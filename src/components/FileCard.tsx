"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { FC, ReactElement, useState } from "react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { formatDistance, subDays } from "date-fns";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { fileIconsList } from "@/lib/constants/filetype";
import { Protect, useSession } from "@clerk/nextjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { useAction, useMutation, useQuery } from "convex/react";
import {
  ArchiveRestore,
  ArchiveRestoreIcon,
  Download,
  MoreVerticalIcon,
  StarIcon,
  Trash,
  Trash2Icon,
  UserIcon,
} from "lucide-react";
import Image from "next/image";
import { toast } from "react-toastify";
import { api } from "../../convex/_generated/api";
import { Doc } from "../../convex/_generated/dataModel";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import DeleteAlert from "./deleteAlert";
import Link from "next/link";

interface FileCardProps {
  file: Doc<"files">;
  organization: string;
  role?: string | null;
  trash?: boolean;
  clerkId?: string | null;
}

interface FileActions {
  file: Doc<"files">;
  role?: string | null;
  clerkId?: string | null;
  table?: boolean;
  orgId?: string | null;
}

export const FileActions = ({
  file,
  role,
  clerkId,
  table,
  orgId,
}: FileActions) => {
  const markfav = useMutation(api.files.markFavourite);
  const unfav = useMutation(api.files.unfavourite);
  const markdelete = useMutation(api.files.markForDeletion);
  const pathname = usePathname();
  const [isOpen, setisOpen] = useState<boolean>(false);
  const getLink = useAction(api.files.getDownloadUrl);
  const restore = useMutation(api.files.restorefile);

  const isTrash = pathname.includes("trash");

  return (
    <>
      <DeleteAlert files={[file]} isOpen={isOpen} setisOpen={setisOpen} />
      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreVerticalIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {!file.deleted && (
            <DropdownMenuItem
              className=" cursor-pointer p-0 "
              onClick={async () => {
                let res = null;
                if (!file.isFavourite) {
                  res = await markfav({
                    clerkId: clerkId || "",
                    fileId: file._id,
                  });
                } else {
                  res = await unfav({
                    clerkId: clerkId || "",
                    fileId: file._id,
                  });
                }

                if (res) toast.success("Marked successfully");
                else toast.error("Something went wrong");
              }}
            >
              <div className=" flex gap-x-2 items-center w-full p-2 hover:text-yellow-500">
                <StarIcon size={20} />
                <p>{file.isFavourite ? "UnFavourite" : "Favourite"}</p>
              </div>
            </DropdownMenuItem>
          )}
          <Protect
            condition={() => role === "org:admin" || role === null}
            fallback={<></>}
          >
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="  cursor-pointer"
              onClick={async () => {
                if (isTrash) {
                  setisOpen(true);
                } else {
                  const res = await markdelete({ fileId: file._id });
                  if (res) toast.success("File Marked for deletion");
                  else toast.error("Permission denied");
                }
              }}
            >
              <div className="text-red-500 flex items-center gap-x-2">
                <Trash2Icon />
                <p>{isTrash ? "Delete" : "Send to Trash"}</p>
              </div>
            </DropdownMenuItem>
           {isTrash && <DropdownMenuItem
                className=" cursor-pointer flex items-center gap-x-2"
                onClick={async () => {
                  const res = await restore({
                    fileId: file._id,
                    orgId: orgId || "",
                  });

                  if (res) toast.success("File restored");
                  else toast.error("Permission denied");
                }}
              >
                <ArchiveRestoreIcon />
                <p>Restore</p>
              </DropdownMenuItem>}
          </Protect>
          {table && !isTrash && (
            <DropdownMenuItem
              className=" flex items-center gap-x-2 cursor-pointer"
              onClick={async () => {
                const link = await getLink({
                  orgId: orgId || "",
                  storageId: file.storageId,
                });
                if (link) window.open(link, "_blank");
              }}
            >
              <Download />
              <p>Download</p>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
const FileCard: FC<FileCardProps> = ({
  file,
  organization,
  role,
  clerkId,
  trash,
}): ReactElement => {
  const getLink = useAction(api.files.getDownloadUrl);

  const restore = useMutation(api.files.restorefile);
  const [isOpen, setisOpen] = useState<boolean>(false);
  const user = useQuery(api.users.getUser, {
    tokenIdentifier: file.authorTokenIdentifier,
  });

  return (
    <>
      <DeleteAlert files={[file]} isOpen={isOpen} setisOpen={setisOpen} />

      <Card className="hover:shadow-lg ">
        <CardHeader>
          <CardTitle className=" flex items-center justify-between">
            <div className=" flex gap-x-4 items-center ">
              <FontAwesomeIcon
                icon={fileIconsList.get(file.type)!}
                size={"sm"}
              />
              <p>{file.name}</p>
            </div>

            {!trash && <FileActions file={file} role={role} clerkId={clerkId} />}
          </CardTitle>
        </CardHeader>

        <CardContent className=" relative aspect-video my-4">
          <Image
            src={file.previewImageUrl || "/filePreview.svg"}
            alt="preview"
            fill
            className="object-left-top object-cover"
          />
        </CardContent>
        <CardFooter className=" flex-col gap-y-4">
          <div className=" flex justify-between items-center w-full">
            <div className=" flex gap-x-2">
              <Avatar>
                <AvatarImage src={user?.image} />
                <AvatarFallback>
                  <UserIcon size={40} className=" border-2 rounded-full p-1" />
                </AvatarFallback>
              </Avatar>

              {user && (
                <span className=" space-y-1">
                  <p>{user.name}</p>
                  <p className=" text-xs">
                    Uploaded {" "}
                    {formatDistance(
                      new Date(),
                      new Date(file._creationTime),
                      { includeSeconds: true,addSuffix: true }
                    )}
                  </p>
                </span>
              )}
            </div>
            {!trash && (
              <Button
                size={"icon"}
                className=" items-center flex gap-x-2"
                onClick={async () => {
                  const link = await getLink({
                    orgId: organization,
                    storageId: file.storageId,
                  });
                  console.log(link);
                  if (link) window.open(link, "_blank");
                }}
              >
                <Download size={20} />
              </Button>
            )}
          </div>

          {trash && (
            <div className=" flex gap-y-4 items-center justify-around w-full">
              <Button
                variant={"outline"}
                onClick={async () => {
                  const res = await restore({
                    fileId: file._id,
                    orgId: organization,
                  });
                  if (res) toast.success("File restored");
                  else toast.error("Something went wrong");
                }}
              >
                Restore
              </Button>
              <Button
                className=""
                variant={"destructive"}
                onClick={async () => {
                  setisOpen(true);
                }}
              >
                Delete
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </>
  );
};

export default FileCard;
