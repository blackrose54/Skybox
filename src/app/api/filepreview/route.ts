import { NextResponse } from "next/server";

import { fetchMutation } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";

export async function POST(req: Request) {
  try {
    const res = await req.json();
  
    const id = res.id;
    const url = res.preview.url;

    const storageId = res.user_data.storageId;

    if (!storageId)
      return NextResponse.json({ error: "Invalid storageID" }, { status: 400 });

    await fetchMutation(api.files.setPreviewImage, {
      id,
      url,
      storageId,
    });
    return NextResponse.json({ Success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
