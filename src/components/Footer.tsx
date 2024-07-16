import Image from "next/image";
import Link from "next/link";
import React, { FC, ReactElement } from "react";

interface FooterProps {}

const Footer: FC<FooterProps> = ({}): ReactElement => {
  return (
    <footer className="relative z-0 p-10 mt-12 text-center container flex justify-center  ">
      <div className="  flex items-center gap-x-2 mx-auto">
        <h1>Made by</h1>
        <a
          href={"https://github.com/blackrose54"}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="https://avatars.githubusercontent.com/u/144953375?v=4"
            alt="🥀🖤"
            height={30}
            width={30}
            className=" object-contain rounded-full"
          />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
