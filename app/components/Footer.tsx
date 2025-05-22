import React from "react";
import { Copyright, Facebook, Slack } from "lucide-react";
import Link from "next/link";
import { RxDiscordLogo } from "react-icons/rx";

const Footer = () => {
  return (
    <div className="dark:bg-white dark:text-black text-white bg-black flex-col md:flex-row flex justify-between p-3">
      <div className="flex justify-center items-center">
        <span className="text-2xl p-3 font-bold">Learn Track</span>
      </div>
      <div className="gap-1 font-semibold text-sm flex justify-center items-center p-2">
        <Copyright height={20} />
        <span>2025. All rights reserved.</span>
      </div>
      <div className="text-sm items-center justify-center flex p-3 gap-2">
        <Link href="" className="flex gap-1 p-1 items-center">
          <Slack />
          <span>Slack</span>
        </Link>
        <Link href="" className="flex gap-1 p-1 items-center">
          <RxDiscordLogo className="text-2xl" />
          <span>Discord</span>
        </Link>
        <Link href="" className="flex gap-1 p-1 items-center">
          <Facebook />
          <span>Facebook</span>
        </Link>
      </div>
    </div>
  );
};

export default Footer;
