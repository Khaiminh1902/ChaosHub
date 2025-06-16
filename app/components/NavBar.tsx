"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const NavBar = () => {
  const pathname = usePathname();
  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <div className="gap-8 flex mr-10">
      <div className={`font-bold ${isActive('/') ? 'text-purple-400' : 'hover:text-purple-400'}`}>
        <Link href="/">Home</Link>
      </div>
      <div className={`font-bold ${isActive('/pomodoro') ? 'text-purple-400' : 'hover:text-purple-400'}`}>
        <Link href="/pomodoro">Pomodoro</Link>
      </div>
      <div className={`font-bold ${isActive('/ai') ? 'text-purple-400' : 'hover:text-purple-400'}`}>
        <Link href="/ai">AI Chat</Link>
      </div>
      <div className={`font-bold ${isActive('/hub') ? 'text-purple-400' : 'hover:text-purple-400'}`}>
        <Link href="/hub">Hub</Link>
      </div>
      <div className={`font-bold ${isActive('/game') ? 'text-purple-400' : 'hover:text-purple-400'}`}>
        <Link href="/game">Game</Link>
      </div>
    </div>
  );
};

export default NavBar;