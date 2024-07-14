import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const filetype = v.union(
  v.literal("pdf"),
  v.literal("image"),
  v.literal("document"),
  v.literal("csv"),
  v.literal("json"),
  v.literal('video'),
  v.literal('ppt'),
  v.literal('audio'),
  v.literal('unknown'),
  v.literal('markdown')

);

export const roles = v.union(
  v.literal("member"),
  v.literal("admin")
)

export type filetype = typeof filetype.type

export const filesValidator = v.object({
  name: v.string(),
  orgId: v.string(),
  storageId: v.id("_storage"),
  authorTokenIdentifier:v.string(),
  type: filetype,
  previewImageUrl:v.optional(v.string()),
  previewId: v.optional(v.string()),
  isFavourite:v.boolean()
});

export const favourites = v.object({
  fileId:v.id("files"),
  tokenIdentifier:v.string(),
  
})

export const usersValidator = v.object({
  clerkId: v.string(),
  name: v.string(),
  image: v.string(),
  orgIds: v.array(v.string()),
  tokenIdentifier: v.string(),
});

export const orgValidator = v.object({
  orgId: v.string(),
  clerkId: v.string(),
  role:roles
});

export default defineSchema({
  files: defineTable(filesValidator).index("by_orgId", ["orgId"]),
  users: defineTable(usersValidator).index("by_clearkId", ["clerkId"]),
  orgs: defineTable(orgValidator)
    .index("by_orgId", ["orgId"])
    .index("by_clerkId", ["clerkId"]),
  favourites: defineTable(favourites).index("by_fileId", ["fileId"]).index("by_tokenIdentifier", ["tokenIdentifier"]),
});
