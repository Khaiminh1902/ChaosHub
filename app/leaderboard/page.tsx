import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

const Leaderboard = () => {
  return (
    <div>
      Leaderboard
      <div className="flex justify-between">
        <Link href="/">
          <ArrowLeft className="size-9" />
        </Link>
        <Link href="/game">
          <ArrowRight className="size-9" />
        </Link>
      </div>
    </div>
  );
};

export default Leaderboard;
