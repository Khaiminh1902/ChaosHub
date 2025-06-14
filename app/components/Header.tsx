"use client";

import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { ModeToggle } from "./ModeToggle";
import NavBar from "./NavBar";

export function Header() {
  const pathname = usePathname();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isAuthPage =
    pathname?.startsWith("/sign-in") || pathname?.startsWith("/sign-up");

  return (
    <header className="flex items-center justify-between p-2 mb-5">
      <div className="flex-1"></div>
      <SignedOut></SignedOut>
      <SignedIn>
        <div className="flex items-center gap-2">
          <NavBar />    
          <ModeToggle />
          <UserButton />
        </div>
      </SignedIn>
    </header>
  );
}
