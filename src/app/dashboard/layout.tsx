import Sidebar from "@/components/Sidebar";
import React, { ReactNode } from "react";

function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className=" flex">
      <Sidebar />
      {children}
    </div>
  );
}

export default DashboardLayout;
