"use node"

import { v } from "convex/values"
import { genThumbnail } from "../src/lib/genThumbnail"
import { internalAction } from "./_generated/server"

export const GenThumbnail = internalAction({
    args:{
        filepath:v.string()
    },
    async handler(ctx, args) {
        console.log(args,'hi')
      const res = await genThumbnail(args.filepath) 
      console.log(res)
      return res
    },
  }) 