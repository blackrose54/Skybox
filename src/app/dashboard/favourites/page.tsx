"use client";

import { useAuth, useOrganization, useSession } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import React, { FC, ReactElement } from "react";
import { api } from "../../../../convex/_generated/api";
import FileList from "@/components/FileList";

interface pageProps {}

const Page: FC<pageProps> = ({}): ReactElement => {
  const {userId,orgRole} = useAuth();
  const orgId = useOrganization().organization?.id;
  const favourites = useQuery(api.files.getFavourites, {
    clerkId: userId || "",
  });

  

  return (
    <main className=" w-full space-y-8 m-8">
      <FileList files={favourites} orgId={orgId} fav={true} role={orgRole}/>
    </main>
  );
};

export default Page;
