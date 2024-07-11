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
  CardDescription,
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

import { Download, MoreVerticalIcon, Trash2Icon } from "lucide-react";
import { Doc } from "../../convex/_generated/dataModel";
import { Button } from "./ui/button";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "react-toastify";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fileIconsList } from "@/lib/constants/filetype";
import { useOrganization } from "@clerk/nextjs";
import { getFileUrl } from "@/lib/utils";

interface FileCardProps {
  file: Doc<"files">;
  organization: string;
}

const FileActions = ({ file }: { file: Doc<"files"> }) => {
  const [isOpen, setisOpen] = useState<boolean>(false);
  const deletefile = useMutation(api.files.DeleteFiles);

  return (
    <>
      <AlertDialog open={isOpen} onOpenChange={(c) => setisOpen(c)}>
        <AlertDialogContent>
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
const FileCard: FC<FileCardProps> = ({ file,organization }): ReactElement => {
  const getLink = useAction(api.files.getDownloadUrl);

  return (
    <Card className="hover:shadow-lg">
      <CardHeader>
        <CardTitle className=" flex items-center justify-between">
          <div className=" flex gap-x-4 items-center ">
            <FontAwesomeIcon icon={fileIconsList.get(file.type)!} size={"sm"} />
            <p>{file.name}</p>
          </div>
          <FileActions file={file} />
        </CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>     
      <CardFooter>
        <Button
          className=" items-center flex gap-x-2"
          onClick={async () => {
            const link = await getLink({
              orgId: organization,
              storageId: file.storageId,
            });
            console.log(link)
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
