"use client";

import { BookUser, FileIcon, StarIcon, TrashIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import SidebarOption from './SidebarOption';
import { SheetClose } from "./ui/sheet";


const items = [
  {
    title:"Favourites",
    Icon:StarIcon,

  },{
    title:"All Files",
    Icon: FileIcon,
  },{
    title:"Trash",
    Icon:TrashIcon
  },{
    title:"My Files",
    Icon:BookUser
  }
]

function Sidebar({...restProps}) {
  const pathname = usePathname();

  return (
    <div className=" w-56 p-8 pt-16 max-md:hidden">
      <ul className=" text-xl font-semibold list-none space-y-8">

        {items.map(item=>{
          return <SidebarOption {...restProps} key={item.title} Icon={item.Icon} title={item.title} pathname={pathname} />
        })}
      </ul>
    </div>
  );
}

export default Sidebar;
