import { httpRouter } from "convex/server";

import { api, internal } from "./_generated/api";
import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
  path: "/clerk",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const payloadString = await request.text();
    const headerPayload = request.headers;

    try {
      const result = await ctx.runAction(internal.clerk.fulfill, {
        payload: payloadString,
        headers: {
          "svix-id": headerPayload.get("svix-id")!,
          "svix-timestamp": headerPayload.get("svix-timestamp")!,
          "svix-signature": headerPayload.get("svix-signature")!,
        },
      });

      switch (result.type) {
        case "user.created":
          await ctx.runMutation(internal.users.createUser, {
            name: `${result.data.first_name ?? ""} ${
              result.data.last_name ?? ""
            }`,
            image: result.data.image_url,
            orgIds: result.data.organization_memberships
              ? result.data.organization_memberships.map((org) => org.id)
              : [],
            clerkId: result.data.id,
            tokenIdentifier: `${process.env.CLERK_API_URL}|${result.data.id}`,
          });
          break;

        case "organization.deleted":
          if (result.data.deleted) {
            const files = await ctx.runQuery(internal.files.getOrgFiles, {
              orgId: result.data.id || "",
            });

            await ctx.runMutation(internal.users.deleteOrg, {
              id: result.data.id!,
            });

            if (files && files.length > 0) {
              await ctx.runMutation(internal.files.deleteFiles, {
                files,
              });
            }
          }

          break;

        case "organizationMembership.created":
          await ctx.runMutation(internal.users.addOrgIdtoUser, {
            clerkId: result.data.public_user_data.user_id,
            orgId: result.data.organization.id,
            role:result.data.role === 'org:admin'?'admin':'member'
          });
          break;
        

        case "organizationMembership.deleted":
          await ctx.runMutation(internal.users.removeUserfromOrg, {
            clerkId: result.data.public_user_data.user_id,
            orgId: result.data.organization.id,
          }); 
        
        case "organizationMembership.updated":
          await ctx.runMutation(internal.users.updateRole,{
            orgId:result.data.organization.id,
            clerkId:result.data.public_user_data.user_id,
            role:result.data.role === 'org:admin'?'admin':'member'
          })

      }

      return new Response(null, {
        status: 200,
      });
    } catch (err) {
      return new Response("Webhook Error", {
        status: 400,
      });
    }
  }),
});

export default http;
