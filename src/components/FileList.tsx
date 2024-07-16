import { Skeleton } from "@/components/ui/skeleton";
import { Doc } from "../../convex/_generated/dataModel";
import FileCard from "./FileCard";

interface props {
  files: Doc<"files">[];
  orgId: string | null | undefined;
  
  role?: string | null;
  trash?: boolean;
  clerkId?: string | null;
}

export const FileListLoading = () => {
  return (
    <div className=" grid grid-flow-row grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
      <Skeleton className=" h-48 w-full rounded-md" />
      <Skeleton className=" h-48 w-full rounded-md" />
      <Skeleton className=" h-48 w-full rounded-md" />
      <Skeleton className=" h-48 w-full rounded-md" />
      <Skeleton className=" h-48 w-full rounded-md" />
      <Skeleton className=" h-48 w-full rounded-md" />
      <Skeleton className=" h-48 w-full rounded-md" />
      <Skeleton className=" h-48 w-full rounded-md" />
      <Skeleton className=" h-48 w-full rounded-md" />
    </div>
  );
};

const FileList = ({
  files,
  orgId,

  role,
  trash,
  clerkId,
}: props) => {
  return (
    <div className=" grid grid-flow-row grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
      {files.map((file) => {
        if (file)
          return (
            <FileCard
              key={file._id}
              file={file}
              organization={orgId || ""}
              role={role}
              trash={trash}
              clerkId={clerkId}
            />
          );
      })}
    </div>
  );
};

export default FileList;
