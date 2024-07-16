import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "../lib/utils";
function SidebarOption({ pathname,title,Icon,...restProps }: { pathname: string,title:string,Icon:LucideIcon }) {
  return (

    <>
      <li className="group transition-all duration-300">
        <Link
          href={"/dashboard/"+title.replace(" ","").toLowerCase()}
          className={cn(" flex items-center gap-x-4 ", {
            "text-sky-500 font-bold": pathname.includes(title.replace(" ","").toLowerCase()),
          })}
          {...restProps}
        >
          <Icon />

          <div >
            <p className=" capitalize">{title}</p>
            <span
              className={cn(
                "block max-w-0 group-hover:max-w-full transition-all duration-500 h-[2px] bg-primary",
                {
                  "bg-sky-500 font-bold": pathname.includes(title.replace(' ','').toLowerCase()),
                }
              )}
            ></span>
          </div>
        </Link>
      </li>
    </>
  );
}

export default SidebarOption;
