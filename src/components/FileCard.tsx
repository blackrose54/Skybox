"use client";

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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAction, useMutation } from "convex/react";
import { Download, MoreVerticalIcon, StarIcon, Trash2Icon } from "lucide-react";
import Image from "next/image";
import { toast } from "react-toastify";
import { api } from "../../convex/_generated/api";
import { Doc } from "../../convex/_generated/dataModel";
import { Button } from "./ui/button";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { useSession } from "@clerk/nextjs";
import { markFavourite } from "../../convex/files";

interface FileCardProps {
  file: Doc<"files">;
  organization: string;
  // isFav:boolean ;
}

const FileActions = ({ file }: { file: Doc<"files"> }) => {
  const [isOpen, setisOpen] = useState<boolean>(false);
  const deletefile = useMutation(api.files.DeleteFiles);
  const session = useSession();
  const markfav = useMutation(api.files.markFavourite);
  const unfav = useMutation(api.files.unfavourite);
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
                await deletefile({ files: [file] });
                toast.success("File deleted successfully");
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreVerticalIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem
            className=" cursor-pointer p-0 "
            onClick={async () => {
              let res = null;
              if (!file.isFavourite) {
                res = await markfav({
                  clerkId: session.session?.user.id || "",
                  fileId: file._id,
                });
              } else {
                res = await unfav({
                  clerkId: session.session?.user.id || "",
                  fileId: file._id,
                });
              }

              if (res) toast.success("Marked as favourite");
              else toast.error("Something went wrong");
            }}
          >
            <div className=" flex gap-x-2 items-center w-full p-2 hover:text-yellow-500">
              <StarIcon size={20} />
              <p>{file.isFavourite ? "UnFavourite" : "Favourite"}</p>
            </div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setisOpen(true)}
            className="  cursor-pointer"
          >
            <div className="text-red-500 flex items-center gap-x-2">
              <Trash2Icon />
              <p>Delete</p>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
const FileCard: FC<FileCardProps> = ({ file, organization }): ReactElement => {
  const getLink = useAction(api.files.getDownloadUrl);
  return (
    <Card className="hover:shadow-lg ">
      <CardHeader>
        <CardTitle className=" flex items-center justify-between">
          <div className=" flex gap-x-4 items-center ">
            <FontAwesomeIcon icon={fileIconsList.get(file.type)!} size={"sm"} />
            <p>{file.name}</p>
          </div>
          <FileActions file={file} />
        </CardTitle>
      </CardHeader>

      <CardContent className=" relative aspect-video my-4">
        <Image
          src={file.previewImageUrl || "/filePreview.svg"}
          alt="preview"
          fill
          className=" object-none"
          sizes=""
        />
      </CardContent>
      <CardFooter>
        <Button
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
          <p>Download</p>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FileCard;
