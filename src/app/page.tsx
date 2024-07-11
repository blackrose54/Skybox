import FileList from "@/components/FileList";
import Search from "@/components/Search";
import UploadButton from "@/components/UploadButton";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="container p-12 space-y-8">
      <div className=" w-full flex items-center justify-between">
        <h1 className=" text-4xl font-bold text-nowrap">Your Files</h1>
        <Search />
        <UploadButton />
      </div>
      <FileList />
    </main>
  );
}
