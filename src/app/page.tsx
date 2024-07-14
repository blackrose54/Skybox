import MainComp from "@/components/mainComponent";
import Search from "@/components/Search";
import Sidebar from "@/components/Sidebar";
import UploadButton from "@/components/UploadButton";
import Link from "next/link";
import { Suspense } from "react";

export default function Home() {
  return (
    <div>
      <Link href={'/dashboard/allfiles'}>
      dashboard</Link>
    </div>
  );
}
