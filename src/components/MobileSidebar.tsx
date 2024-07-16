"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

import React from "react";
import Sidebar from "./Sidebar";
import { MenuIcon } from "lucide-react";
import { usePathname } from "next/navigation";

export default function MobileSidebar() {
  const pathname = usePathname();
  if (pathname === "/") return <></>;
  return (
    <Sheet>
      <SheetTrigger>
        <MenuIcon size={30} className=" md:hidden " />
      </SheetTrigger>
      <SheetContent side={"left"}>
        <SheetClose asChild>
          <Sidebar />
        </SheetClose>
      </SheetContent>
    </Sheet>
  );
}
