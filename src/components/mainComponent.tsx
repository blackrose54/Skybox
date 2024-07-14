"use client";

import { useOrganization } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { useSearchParams } from "next/navigation";
import { api } from "../../convex/_generated/api";
import Search from "./Search";
import UploadButton from "./UploadButton";
import Sidebar from "./Sidebar";

export default function MainComp() {
  

  return (
    <div className="flex">
      <Sidebar />
      
    </div>
  );
}
