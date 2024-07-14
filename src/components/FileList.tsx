
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { ReactElement } from "react";
import { Doc } from "../../convex/_generated/dataModel";
import FileCard from "./FileCard";
import { useSearchParams } from "next/navigation";
import { auth, currentUser, getAuth } from "@clerk/nextjs/server";

interface props {
  files?: (Doc<"files">|null)[] | null;
  orgId: string | null | undefined;
  query?:string|null;
  fav?:boolean;
  role?:string|null
}

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
      <Skeleton className=" h-48 w-full rounded-md" />
    </>
  );
};

const FileList = ({ files, orgId ,query,fav,role}: props) => {
 
  return (
    <div className=" grid grid-flow-row grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
      {files ? (
        files.length > 0 ? (
          files.map((file) => {

            if(file) return(
            <FileCard key={file._id} file={file} organization={orgId || ""} role={role} />
          )})
        ) :query ?(
          <div className=" container col-span-full space-y-4 mt-8">
          <Image
            src={"/emptyResult.svg"}
            alt="logo"
            width={400}
            height={400}
            className=" mx-auto"
          />
          <p className=" text-center">
            No files were found for the given query!
          </p>
        </div>
        ):fav ?(
          <div className=" container col-span-full space-y-4 mt-8">
            <Image
              src={"/favourite.svg"}
              alt="logo"
              width={300}
              height={300}
              className=" mx-auto"
            />
            <p className=" text-center">
              You Don&apos;t have any files marked as Favourite.
            </p>
          </div>
        ) : (
          <div className=" container col-span-full space-y-4 mt-8">
            <Image
              src={"/uploadPlaceholder.svg"}
              alt="logo"
              width={400}
              height={400}
              className=" mx-auto"
            />
            <p className=" text-center">
              You Don&apos;t have any files. Upload One
            </p>
          </div>
        )
      ) : (
        <FileListLoading />
      )}
    </div>
  );
};

export default FileList;
