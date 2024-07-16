import Sidebar from "@/components/Sidebar";
import Searchbar from "@/components/Searchbar";
import React, { ReactNode } from "react";

function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className=" flex ">
      <div className=" max-md:hidden">

      <Sidebar />
      </div>
      <div className="space-y-8 w-full p-4 ">
        <Searchbar />
        {children}
      </div>
    </div>
  );
}

export default DashboardLayout;
