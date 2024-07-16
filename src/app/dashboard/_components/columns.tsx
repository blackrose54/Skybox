"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, UserIcon } from "lucide-react";

import { FileActions } from "@/components/FileCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistance, subDays } from "date-fns";
import { Doc } from "../../../../convex/_generated/dataModel";

export type File = {
  file: Doc<"files">;
  username: string;
  imgUrl: string;
  orgId?: string | null;
  orgRole?: string | null;
  clerkId?: string | null;
};

export const columns: ColumnDef<File>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return <p>{row.original.file.name}</p>;
    },
  },
  {
    accessorKey: "username",
    header: "User",
    cell: ({ row }) => {
      return (
        <div className=" flex items-center gap-x-3">
          <Avatar>
            <AvatarImage src={row.original.imgUrl} />
            <AvatarFallback>
              <UserIcon size={40} className=" border-2 rounded-full p-1" />
            </AvatarFallback>
          </Avatar>
          <p>{row.original.username}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "uploadedDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Upload Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell({ row }) {
      return (
        <p className=" ml-4">
          Uploaded {" "}
          {formatDistance(
            new Date(),
            new Date(row.original.file._creationTime),
            { includeSeconds: true, addSuffix: true }
          )}
        </p>
      );
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell({ row }) {
      return <p className=" ml-4">{row.original.file.type}</p>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <FileActions
          file={row.original.file}
          clerkId={row.original.clerkId}
          role={row.original.orgRole}
          table
          orgId={row.original.orgId}
        />
      );
    },
  },
];
