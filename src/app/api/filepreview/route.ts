import { NextResponse } from "next/server";

export async function POST(req:Request){
    const res = await req.json();
    console.log(res);

    return NextResponse.json({"Success": true})
}