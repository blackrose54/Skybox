"use client";

import FileList from "@/components/FileList";
import Search from "@/components/Search";
import UploadButton from "@/components/UploadButton";
import { useOrganization } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { useSearchParams } from "next/navigation";
import React, { FC, ReactElement } from "react";
import { api } from "../../../../convex/_generated/api";

interface pageProps {}

const Page: FC<pageProps> = ({}): ReactElement => {
  const params = useSearchParams();
  const orgId = useOrganization().organization?.id;
  const files = useQuery(api.files.getFile, {
    orgId: orgId || "",
    query: params.get("search") ?? undefined,
  });
  return (
    <div className="w-full space-y-8 m-8">
      <div className=" w-full flex items-center justify-between gap-x-4">
        <h1 className=" text-2xl md:text-4xl font-bold text-nowrap ">
          Your Files
        </h1>
        <Search query={params.get("search") || ""} />
        <UploadButton />
      </div>
      <FileList files={files} orgId={orgId} query={params.get("search")} />
    </div>
  );
};

export default Page;
