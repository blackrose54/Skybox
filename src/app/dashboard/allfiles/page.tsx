"use client";

import FileList from "@/components/FileList";
import { useAuth, useOrganization } from "@clerk/nextjs";
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
  })
  const {orgRole,userId} = useAuth()
  return (
     <FileList files={files?.filter(file=>!file.deleted)} clerkId={userId} orgId={orgId} query={params.get("search")} role={orgRole}/>
  );
};

export default Page;
