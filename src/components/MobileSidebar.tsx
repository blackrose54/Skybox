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
    <Sheet>
      <SheetTrigger>
        <MenuIcon />
        
      </SheetTrigger>
      <SheetContent>
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
}
