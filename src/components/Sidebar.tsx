"use client";

import { cn } from "@/lib/utils";
import { FileIcon, StarIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function Sidebar() {
  const pathname = usePathname();

  return (
    <div className=" w-56 p-8 pt-16  ">
      <ul className=" text-xl font-semibold list-none space-y-8">
        <li className="">
          <Link
            href={"/dashboard/allfiles"}
            className={cn(" flex items-center gap-x-4 ", {
              "text-sky-500": pathname.includes("allfiles"),
            })}
          >
            <FileIcon />
            <div className=" group transition duration-300">
              <p>All Files</p>
              <span
                className={cn(
                  "block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-primary",
                  {
                    "bg-sky-500": pathname.includes("allfiles"),
                  }
                )}
              ></span>
            </div>
          </Link>
        </li>
        <li className="group transition duration-300">
          <Link
            href={"/dashboard/favourites"}
            className={cn(" flex items-center gap-x-4 ", {
              "text-sky-500": pathname.includes("favourites"),
            })}
          >
            <StarIcon />
            <div className=" ">
              <p>Favourites</p>
              <span
                className={cn(
                  "block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-primary",
                  {
                    "bg-sky-500": pathname.includes("favourites"),
                  }
                )}
              ></span>
            </div>
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
