import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

const Game = () => {
  return (
    <div>
      Mini Game
      <div className="flex justify-between">
        <Link href="/leaderboard">
          <ArrowLeft className="size-9" />
        </Link>
      </div>
    </div>
  );
};

export default Game;
