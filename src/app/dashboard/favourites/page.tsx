"use client";

import { useAuth, useOrganization, useSession } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import React, { FC, ReactElement } from "react";
import { api } from "../../../../convex/_generated/api";
import FileList from "@/components/FileList";
import { useSearchParams } from "next/navigation";

interface pageProps {}

const Page: FC<pageProps> = ({}): ReactElement => {
  const {userId,orgRole,orgId} = useAuth();
  const params = useSearchParams()
  const favourites = useQuery(api.files.getFavourites, {
    clerkId: userId || "",
  })?.filter(val=>val?.name.includes(params.get('search') ?? ""))

  return (
    <main className=" w-full space-y-8 m-8">
      <FileList files={favourites} orgId={orgId} clerkId={userId} fav={true} role={orgRole} query={params.get("search")}/>
    </main>
  );
};

export default Page;
