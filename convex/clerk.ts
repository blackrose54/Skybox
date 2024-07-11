"use node";

import type { WebhookEvent } from "@clerk/clerk-sdk-node";
import { ConvexError, v } from "convex/values";
import { Webhook } from "svix";

import { internalAction } from "./_generated/server";



export const fulfill = internalAction({
  args: { headers: v.any(), payload: v.string() },
  handler: async (ctx, args) => {
    if(!process.env.CLERK_WEBHOOK_SECRET) throw new ConvexError("webhook secret is required")
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    const payload = wh.verify(args.payload, args.headers) as WebhookEvent;
    return payload;
  },
});