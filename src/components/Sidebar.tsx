"use client";

import { FileIcon, Icon, StarIcon, TrashIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import SidebarOption from './SidebarOption'


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
  }
]

function Sidebar() {
  const pathname = usePathname();

  return (
    <div className=" w-56 p-8 pt-16  ">
      <ul className=" text-xl font-semibold list-none space-y-8">
        {items.map(item=>{
          return <SidebarOption key={item.title} Icon={item.Icon} title={item.title} pathname={pathname} />
        })}
       

      </ul>
    </div>
  );
}

export default Sidebar;
