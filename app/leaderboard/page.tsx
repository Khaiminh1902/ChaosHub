import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

const Leaderboard = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold flex items-center justify-center">
        Leaderboard
      </h1>
      <div>Leaderboard Section</div>
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
