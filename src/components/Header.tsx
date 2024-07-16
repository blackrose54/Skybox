import {
  OrganizationSwitcher,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { Button } from "./ui/button";
import MobileSidebar from "./MobileSidebar";

interface HeaderProps {}

const Header: FC<HeaderProps> = async ({}) => {
  return (
    <header className="relative backdrop-blur-xl w-full bg-secondary h-20 px-2 md:px-8  py-4 flex items-center justify-between border-b-2 border-border z-50">
      <Link href={"/"} className=" flex items-center gap-x-4">
        <div className=" md:hidden">
          <MobileSidebar />
        </div>
        <div className=" relative h-12 w-12 aspect-square">
          <Image
            src={"/logo.png"}
            alt="logo"
            fill
            className=" object-contain rounded-full"
          />
        </div>
        <p className="p-1 max-md:hidden font-bold text-4xl bg-gradient-to-r from-yellow-600 via-red-400 to-blue-700 text-transparent bg-clip-text font-sans">
          Skybox
        </p>
      </Link>

      <div>
        <SignedIn>
          <OrganizationSwitcher />
          <UserButton />
        </SignedIn>
        <SignedOut>
          <SignInButton
            fallbackRedirectUrl={"/dashboard/allfiles"}
            forceRedirectUrl={"/dashboard/allfiles"}
          >
            <Button>Sign In </Button>
          </SignInButton>
        </SignedOut>
      </div>
    </header>
  );
};

export default Header;
