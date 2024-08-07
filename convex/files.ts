import { v } from "convex/values";
import { api, internal } from "./_generated/api";
import { Doc, Id } from "./_generated/dataModel";
import {
  action,
  internalMutation,
  internalQuery,
  mutation,
  query,
  QueryCtx
} from "./_generated/server";
import { filetype } from "./schema";


export const hasAccess = async (
  ctx: QueryCtx,
  fileId: Id<"files">
) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return false;

  const user = await ctx.db
    .query("users")
    .filter((user) =>
      user.eq(user.field("tokenIdentifier"), identity.tokenIdentifier)
    )
    .first();

  if (!user) return false;

  const file = await ctx.db
    .query("files")
    .withIndex("by_id", (v) => v.eq("_id", fileId))
    .first();
  if (!file) return false;

  if (file.authorTokenIdentifier === identity.tokenIdentifier) return true;

  //check if user belongs to the same organization as file
  const org = await ctx.db
    .query("orgs")
    .withIndex("by_orgId", (v) => v.eq("orgId", file.orgId ))
    .filter((q) => q.eq(q.field("clerkId"), user.clerkId))
    .first();

  if (org?.role !== "admin") return false;
  return true;
};

export const getFile = query({
  args: {
    orgId: v.string(),
    query: v.optional(v.string()),
    onlyAuthor: v.optional(v.boolean()),
    orgRole: v.optional(v.union(v.null(),v.string())),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) return [];

    let files = [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenidentifier", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .first();

    if (!user) return [];

    if (args.onlyAuthor) {
      files = await ctx.db
        .query("files")
        .filter((f) =>
          f.eq(f.field("authorTokenIdentifier"), identity.tokenIdentifier)
        )
        .collect();

      
    } else {
      if (args.orgId == "") {
        args.orgId = identity.tokenIdentifier;
      }

      files = await ctx.db
        .query("files")
        .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
        .collect();

      const q = args.query;

      if (q) {
        files = files.filter((file) => file.name.includes(q))
      }      
    }

    return files.map((file) => ({
      file: file,
      username: user.name,
      orgId: args.orgId,
      orgRole: args.orgRole,
      clerkId: user.clerkId,
      imgUrl: user.image,
    }));
  },
});

export const markFavourite = mutation({
  args: {
    clerkId: v.string(),
    fileId: v.id("files"),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return;

    const file = await ctx.db
      .query("files")
      .filter((v) => v.eq(v.field("_id"), args.fileId))
      .first();

    if (!file) return null;

    const user = await ctx.db
      .query("users")
      .filter((v) => v.eq(v.field("clerkId"), args.clerkId))
      .first();

    if (!user || user.tokenIdentifier !== identity.tokenIdentifier) return null;

    await ctx.db.insert("favourites", {
      tokenIdentifier: identity.tokenIdentifier,
      fileId: args.fileId,
    });

    await ctx.db.patch(file._id, { isFavourite: true });

    return true;
  },
});

export const unfavourite = mutation({
  args: { clerkId: v.string(), fileId: v.id("files") },
  async handler(ctx, args) {
    try {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) return;

      const user = await ctx.db
        .query("users")
        .filter((v) => v.eq(v.field("clerkId"), args.clerkId))
        .first();

      if (!user || user.tokenIdentifier !== identity.tokenIdentifier) return;

      const favourite = await ctx.db
        .query("favourites")
        .withIndex("by_fileId", (q) => q.eq("fileId", args.fileId))
        .first();

      if (!favourite) return;

      await ctx.db.patch(args.fileId, { isFavourite: false });
      await ctx.db.delete(favourite._id);

      return true;
    } catch (error) {
      console.log(error);
      return null;
    }
  },
});

export const getFavourites = query({
  args: {
    clerkId: v.string(),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .filter((user) => user.eq(user.field("clerkId"), args.clerkId))
      .first();

    if (!user || user.tokenIdentifier !== identity.tokenIdentifier) return [];

    const files = await ctx.db
      .query("favourites")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", user.tokenIdentifier)
      )
      .collect();

    const promises = files.map(
      async (file) =>
        await ctx.db
          .query("files")
          .withIndex("by_id", (q) => q.eq("_id", file.fileId))
          .first()
    );

    const res = await Promise.all(promises);

    return res.filter((r) => r && !r.deleted);
  },
});

export const restorefile = mutation({
  args: {
    fileId: v.id("files"),
    orgId: v.string(),
  },
  async handler(ctx, args) {
    const hasacess = await hasAccess(ctx,  args.fileId);
    
    if (hasacess) {
      await ctx.db.patch(args.fileId, { deleted: false });
      return true;
    }else return false;
  },
});

export const clearTrash = internalMutation({
  args: {},
  async handler(ctx) {
    const files = await ctx.db
      .query("files")
      .filter((f) => f.eq(f.field("deleted"), true))
      .collect();
    await Promise.all(
      files.map(async (file) => {
        await ctx.storage.delete(file.storageId);
        await ctx.db.delete(file._id);
      })
    );
  },
});

export const markForDeletion = mutation({
  args: {
    fileId: v.id("files"),
  },
  async handler(ctx, args) {
   const hasaccess = await hasAccess(ctx,args.fileId);

    if (hasaccess) {
      await ctx.db.patch(args.fileId, { deleted: true });
      return true;
    }
    return false;
  },
});

export const deleteFiles = internalMutation({
  async handler(ctx, args: { files: Doc<"files">[] }) {
    args.files.forEach(async (file) => {
      await ctx.db.delete(file._id);
      await ctx.storage.delete(file.storageId);
    });
  },
});

export const getOrgFiles = internalQuery({
  args: {
    orgId: v.string(),
  },
  async handler(ctx, args) {
    return ctx.db
      .query("files")
      .filter((q) => q.eq(q.field("orgId"), args.orgId))
      .collect();
  },
});

export const generateUploadUrl = mutation({
  args: {
    // ...
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    // Return an upload URL
    return await ctx.storage.generateUploadUrl();
  },
});

export const sendFile = action({
  args: {
    storageId: v.id("_storage"),
    orgId: v.string(),
    name: v.string(),
    type: filetype,
  },
  async handler(ctx, args) {
    const res = await ctx.runMutation(api.files.uploadFile, {
      storageId: args.storageId,
      orgId: args.orgId,
      name: args.name,
      type: args.type,
    });

    const filepath = await ctx.storage.getUrl(args.storageId);
    console.log(filepath);
    if (filepath) {
      const thumb = await ctx.runAction(internal.genThumbnail.GenThumbnail, {
        filepath,
        storageId: args.storageId,
      });
      console.log(thumb);
    }
  },
});

export const uploadFile = mutation({
  args: {
    storageId: v.id("_storage"),
    orgId: v.string(),
    name: v.string(),
    type: filetype,
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    await ctx.db.insert("files", {
      storageId: args.storageId,
      orgId: args.orgId || identity.tokenIdentifier,
      name: args.name,
      type: args.type,
      authorTokenIdentifier: identity.tokenIdentifier,
      isFavourite: false,
    });
  },
});

export const setPreviewImage = mutation({
  args: {
    url: v.string(),
    id: v.string(),
    storageId: v.id("_storage"),
  },
  async handler(ctx, args) {
    const file = await ctx.db
      .query("files")
      .filter((file) => file.eq(file.field("storageId"), args.storageId))
      .first();
    if (file) {
      await ctx.db.patch(file._id, {
        previewId: args.id,
        previewImageUrl: args.url,
      });
    }
  },
});

export const DeleteFiles = mutation({
  async handler(ctx, args: { files: Doc<"files">[] }) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return false;

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("tokenIdentifier"), identity.tokenIdentifier))
      .first();

    if (!user) return false;

    const res = await Promise.all(
      args.files.map(async (file) => {
        const orgId = (
          await ctx.db
            .query("files")
            .withIndex("by_id", (q) => q.eq("_id", file._id))
            .first()
        )?.orgId;

        const isAdmin = await ctx.db
          .query("orgs")
          .filter((q) =>
            q.and(
              q.eq(q.field("orgId"), orgId),
              q.eq(q.field("clerkId"), user.clerkId)
            )
          )
          .first();

        if (
          isAdmin?.role == "admin" ||
          file.authorTokenIdentifier === identity.tokenIdentifier
        ) {
          await ctx.storage.delete(file.storageId);
          await ctx.db.delete(file._id);
          return true;
        } else {
          return false;
        }
      })
    );

    return res.every((val) => val);
  },
});

export const getuser = internalQuery({
  args: {
    tokenIdentifier: v.string(),
  },
  async handler(ctx, args) {
    return await ctx.db
      .query("users")
      .filter((v) => v.eq(v.field("tokenIdentifier"), args.tokenIdentifier))
      .first();
  },
});

export const getOrg = internalQuery({
  args: {
    orgId: v.string(),
    clerkId: v.string(),
  },
  async handler(ctx, args) {
    return await ctx.db
      .query("orgs")
      .filter((v) =>
        v.and(
          v.eq(v.field("orgId"), args.orgId),
          v.eq(v.field("clerkId"), args.clerkId)
        )
      )
      .first();
  },
});

export const getDownloadUrl = action({
  args: {
    storageId: v.id("_storage"),
    orgId: v.string(),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return;

    if (args.orgId == "") args.orgId = identity.tokenIdentifier;

    const user = await ctx.runQuery(internal.files.getuser, {
      tokenIdentifier: identity.tokenIdentifier,
    });

    if (!user) return;

    let org = null;

    if (identity.tokenIdentifier !== args.orgId) {
      org = await ctx.runQuery(internal.files.getOrg, {
        clerkId: user.clerkId,
        orgId: args.orgId,
      });
    } else {
      org = identity.tokenIdentifier;
    }

    if (org) return await ctx.storage.getUrl(args.storageId);
  },
});
