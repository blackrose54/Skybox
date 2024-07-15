import {
  OrganizationSwitcher,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { FC, ReactElement } from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import Link from "next/link";

interface HeaderProps {}

const Header: FC<HeaderProps> = ({}): ReactElement => {
  return (
    <div className=" w-full bg-secondary h-20 px-8 py-4 flex items-center justify-between border-b-2 border-border z-50">
      <Link href={'/'}>
      <div className=" relative h-16 w-16 aspect-square">
        <Image
          src={"/favicon.png"}
          alt="logo"
          fill
          className=" object-contain"
        />
      </div>
      </Link>

      <Link href={'/dashboard/files'}>
        <Button variant={'outline'}>Your Files</Button>
      </Link>

      <div>
        <SignedIn>
          <OrganizationSwitcher />
          <UserButton />
        </SignedIn>
        <SignedOut>
          <SignInButton>
            <Button>Sign In </Button>
          </SignInButton>
        </SignedOut>
      </div>
    </div>
  );
};

export default Header;
