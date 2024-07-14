"use node"

import { v } from "convex/values"
import { genThumbnail } from "../src/lib/genThumbnail"
import { internalAction } from "./_generated/server"

export const GenThumbnail = internalAction({
    args:{
        filepath:v.string(),
        storageId:v.id("_storage")
    },
    async handler(ctx, args) {
      const res = await genThumbnail(args.filepath,args.storageId) 
      console.log(res)
      return res
    },
  }) 