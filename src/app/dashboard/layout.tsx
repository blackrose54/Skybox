import Sidebar from "@/components/Sidebar";
import Searchbar from "@/components/Searchbar";
import React, { ReactNode } from "react";

function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className=" flex ">
      <Sidebar />
      <div className="space-y-8 w-full p-4 ">
        <Searchbar />
        {children}
      </div>
    </div>
  );
}

export default DashboardLayout;
