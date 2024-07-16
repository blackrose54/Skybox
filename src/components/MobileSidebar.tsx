import {
  Sheet,
  SheetContent,

  SheetTrigger,
} from "@/components/ui/sheet";

import React from "react";
import Sidebar from "./Sidebar";
import { MenuIcon } from "lucide-react";

export default function MobileSidebar() {
  return (
    <Sheet  >
      <SheetTrigger className=" md:hidden">
        <MenuIcon />        
      </SheetTrigger>
      <SheetContent side={'left'} >
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
}
