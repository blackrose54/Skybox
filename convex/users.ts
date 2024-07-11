import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";

export const createUser = internalMutation({
    args:{
        clerkId:v.string(),
        orgIds:v.array(v.string()),
        name:v.string(),
        image:v.string(),
        tokenIdentifier:v.string()
    },
    async handler(ctx, args) {
        await ctx.db.insert('users',args)
    },
})

export const addOrgIdtoUser = internalMutation({
    args:{
        clerkId:v.string(),
        orgId:v.string()
    },
    async handler(ctx, args) {
        await ctx.db.insert('orgs',{
            orgId:args.orgId,
            clerkId:args.clerkId
        })
    },
})

export const getUserbyClerkId = internalQuery({
    args:{
        id:v.string()
    },
    async handler(ctx, args) {
        return await ctx.db.query('users').filter(v=>v.eq(v.field('clerkId'),args.id)).first()
    },
})

export const getUsersbyOrgId = internalQuery({
    args:{
        id:v.string()
    },
    async handler(ctx, args) {
        return await ctx.db.query('orgs').filter(v=>v.eq(v.field('orgId'),args.id)).collect()
    },
})

export const deleteOrg = internalMutation({
    args:{
        id:v.string()
    },
    async handler(ctx, args) {
        const orgids = await ctx.db.query('orgs').filter(v=>v.eq(v.field('orgId'),args.id)).collect()
        orgids.forEach(async (orgids) =>{
            await ctx.db.delete(orgids._id)
        })
    },

})

export const removeUserfromOrg = internalMutation({
    args:{
        clerkId:v.string(),
        orgId:v.string()
    },
    async handler(ctx, args) {
       const ids = await ctx.db.query('orgs').filter(v=>v.and(v.eq(v.field('clerkId'),args.clerkId),v.eq(v.field('orgId'),args.orgId))).collect() 
       ids.forEach(async (ids) =>{
            await ctx.db.delete(ids._id)
       })
    },
})