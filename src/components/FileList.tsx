"use client";

import { useOrganization } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { FC, ReactElement, Suspense, useEffect, useRef, useState } from "react";
import { api } from "../../convex/_generated/api";
import FileCard from "./FileCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Doc } from "../../convex/_generated/dataModel";
import Image from "next/image";

interface FileListProps {}

const FileListLoading = () => {
  return (
    <>
      <Skeleton className=" h-48 w-full rounded-md" />
      <Skeleton className=" h-48 w-full rounded-md" />
      <Skeleton className=" h-48 w-full rounded-md" />
      <Skeleton className=" h-48 w-full rounded-md" />
      <Skeleton className=" h-48 w-full rounded-md" />
      <Skeleton className=" h-48 w-full rounded-md" />
      <Skeleton className=" h-48 w-full rounded-md" />
      <Skeleton className=" h-48 w-full rounded-md" />
    </>
  );
};

const FileList: FC<FileListProps> = ({}): ReactElement => {
  const orgId = useOrganization().organization?.id;
  const files = useQuery(api.files.getFile, {
    orgId: orgId || "",
  });

  return (
    <div className=" grid grid-flow-row grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
      {files ? (
        files.length > 0 ? (
          files.map((file) => <FileCard key={file._id} file={file} organization={orgId||""} />)
        ) : (
          <div className=" container col-span-full space-y-4 mt-8">
            <Image
              src={"/uploadPlaceholder.svg"}
              alt="logo"
              width={400}
              height={400}
              className=" mx-auto"
            />
            <p className=" text-center">You Don&apos;t have any files. Upload One</p>
          </div>
        )
      ) : (
        <FileListLoading />
      )}
    </div>
  );
};

export default FileList;
