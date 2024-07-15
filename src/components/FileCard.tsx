"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { FC, ReactElement, useState } from "react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
  Download,
  MoreVerticalIcon,
  StarIcon,
  Trash2Icon,
  UserIcon,
} from "lucide-react";
import Image from "next/image";
import { toast } from "react-toastify";
import { api } from "../../convex/_generated/api";
import { Doc } from "../../convex/_generated/dataModel";
import { Button } from "./ui/button";

interface FileCardProps {
  file: Doc<"files">;
  organization: string;
  role?: string | null;
  trash?: boolean;
  clerkId?: string | null;
}

const FileActions = ({ file, role, clerkId }: FileCardProps) => {
  const markfav = useMutation(api.files.markFavourite);
  const unfav = useMutation(api.files.unfavourite);
  const markdelete = useMutation(api.files.markForDeletion);

  return (
    <>
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
                const res = await markdelete({ fileId: file._id });
                if (res) toast.success("File Marked for deletion");
                else toast.error("Permission denied");
              }}
            >
              <div className="text-red-500 flex items-center gap-x-2">
                <Trash2Icon />
                <p>Send to Trash</p>
              </div>
            </DropdownMenuItem>
          </Protect>
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

  const deletefile = useMutation(api.files.DeleteFiles);
  const restore = useMutation(api.files.restorefile);
  const [isOpen, setisOpen] = useState<boolean>(false);
  const user = useQuery(api.users.getUserImage, {
    tokenIdentifier: file.authorTokenIdentifier,
  });

  return (
    <>
      <AlertDialog open={isOpen} onOpenChange={(c) => setisOpen(c)}>
        <AlertDialogContent>
          <AlertDialogTitle hidden>Confirmation</AlertDialogTitle>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              file and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                const res = await deletefile({ files: [file] });
                if (res) toast.success("File deleted successfully");
                else toast.error("Something went wrong");
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
            {!trash && (
              <FileActions
                file={file}
                organization={organization}
                role={role}
                trash
                clerkId={clerkId}
              />
            )}
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
                    {new Date(file._creationTime).toLocaleString()}
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
