"use client";

import FileList from "@/components/FileList";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { LayoutGrid, TableIcon } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { api } from "../../../../convex/_generated/api";
import { columns } from "./columns";
import { DataTable } from "./data-table";

const Filebrowser = ({
  trash,
  favourites,
  authorOnly,
}: {
  trash?: boolean;
  favourites?: boolean;
  authorOnly?: boolean;
}) => {
  const { orgId, orgRole, userId } = useAuth();
  let fileTable = useQuery(api.files.getFile, {
    orgId: orgId ?? "",
    onlyAuthor: authorOnly,
    orgRole: orgRole ,
  });

  const [filetype, settype] = useState<string>("All");

  const params = useSearchParams();

  const query = params.get("search");

  if (trash) fileTable = fileTable?.filter((f) => f.file.deleted);
  else if (favourites)
    fileTable = fileTable?.filter((f) => f.file.isFavourite && !f.file.deleted);
  else fileTable = fileTable?.filter((f) => !f.file.deleted);

  if (query) fileTable = fileTable?.filter((f) => f.file.name.includes(query));
  if (filetype !== "All")
    fileTable = fileTable?.filter((f) => f.file.type === filetype);

  return (
    <div className="  ">
      <Tabs defaultValue="grid" className=" space-y-6">
        <div className=" flex flex-wrap gap-y-4 justify-between items-center">
          <TabsList className="p-1">
            <TabsTrigger className=" flex gap-x-2 items-center " value="grid">
              <LayoutGrid /> <p>Grid</p>
            </TabsTrigger>
            <TabsTrigger className=" flex gap-x-2 items-center" value="table">
              <TableIcon />
              <p>Table</p>
            </TabsTrigger>
          </TabsList>

          <div className=" flex gap-x-4 items-center ">
            <p className=" font-semibold">Type Filter</p>
            <Select value={filetype} onValueChange={(e) => settype(e)}>
              <SelectTrigger className="w-[180px] focus:ring-offset-0 focus-visible:ring-0">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>

                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="document">Document</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="ppt">PPT</SelectItem>
                <SelectItem value="audio">Audio</SelectItem>
                <SelectItem value="Markdown">Markdown</SelectItem>
                <SelectItem value="unknown">Unknown</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {!fileTable ? (
          <div className="loader">loading...</div>
        ) : fileTable.length > 0 ? (
          <>
            <TabsContent value="grid" className=" w-full">
              <FileList
                orgId={orgId}
                role={orgRole}
                clerkId={userId}
                files={fileTable.map((f) => f.file) ?? []}
                trash={trash}
              />
            </TabsContent>
            <TabsContent value="table" className=" w-full">
              <DataTable data={fileTable ?? []} columns={columns} />
            </TabsContent>
          </>
        ) : query ? (
          <div className=" col-span-full space-y-4 mt-8">
            <Image
              src={"/emptyresult.svg"}
              alt="logo"
              width={400}
              height={400}
              className=" mx-auto"
            />
            <p className=" text-center">
              No files were found for the given query!
            </p>
          </div>
        ) : favourites ? (
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
        ) : trash ? (
          <div className=" container col-span-full space-y-4 mt-8">
            <Image
              src={"/trash.svg"}
              alt="logo"
              width={400}
              height={400}
              className=" mx-auto"
            />
            <p className=" text-center">
              You Don&apos;t have any files in trash.
            </p>
          </div>
        ) : filetype === "All" ? (
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
        ) : (
          <div className=" container col-span-full space-y-4 mt-8">
            <Image
              src={"/emptyresult.svg"}
              alt="logo"
              width={400}
              height={400}
              className=" mx-auto"
            />
            <p className=" text-center">No files found of this type.</p>
          </div>
        )}
      </Tabs>
    </div>
  );
};

export default Filebrowser;
