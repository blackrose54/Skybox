import { v } from "convex/values";
import { Doc } from "./_generated/dataModel";
import {
  action,
  internalAction,
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";
import { filetype } from "./schema";
import { api, internal } from "./_generated/api";

export const getFile = query({
  args: {
    orgId: v.string(),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) return;

    if (args.orgId == "") {
      args.orgId = identity.tokenIdentifier;
    }

    return ctx.db
      .query("files")
      .filter((q) => q.eq(q.field("orgId"), args.orgId))
      .collect();
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
    console.log(filepath)
    if (filepath) {
      const thumb = await ctx.runAction(internal.genThumbnail.GenThumbnail, {
        filepath,
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
    });
  },
});

export const DeleteFiles = mutation({
  async handler(ctx, args: { files: Doc<"files">[] }) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    args.files.forEach(async (file) => {
      await ctx.storage.delete(file.storageId);
      await ctx.db.delete(file._id);
    });
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
