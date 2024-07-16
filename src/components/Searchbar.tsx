"use client";
import React from "react";
import Search from "./Search";
import UploadButton from "./UploadButton";
import { usePathname, useSearchParams } from "next/navigation";

export default function Searchbar() {
  const params = useSearchParams();
  const pathname = usePathname();
  return (
    <div className=" w-full max-sm:flex-wrap max-sm:gap-y-4 flex items-center justify-between gap-x-4">
      <h1 className=" text-2xl md:text-4xl font-bold text-nowrap ">
        Your Files
      </h1>
      <Search query={params.get("search") || ""} route={pathname} />
      <UploadButton />
    </div>
  );
}
