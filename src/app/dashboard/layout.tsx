import Sidebar from "@/components/Sidebar";
import Searchbar from "@/components/Searchbar";
import React, { ReactNode } from "react";

function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className=" flex">
      <Sidebar />
      <div className="w-full space-y-8 m-8">
        <Searchbar />
        {children}
      </div>
    </div>
  );
}

export default DashboardLayout;
