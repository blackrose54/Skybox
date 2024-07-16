"use client";

import React, { useState } from "react";

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
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "react-toastify";
import { Doc } from "../../convex/_generated/dataModel";

export default function DeleteAlert({files,isOpen,setisOpen}:{files:Doc<"files">[],isOpen:boolean,setisOpen:Function}) {
  const deletefile = useMutation(api.files.DeleteFiles);

  return (
    <AlertDialog open={isOpen} onOpenChange={(c) => setisOpen(c)}>
      <AlertDialogContent>
        <AlertDialogTitle hidden>Confirmation</AlertDialogTitle>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your file
            and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              const res = await deletefile({ files: [...files] });
              if (res) toast.success("File deleted successfully");
              else toast.error("Something went wrong");
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
