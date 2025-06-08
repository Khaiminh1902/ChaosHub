import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";
import SnakeGrid from "../components/SnakeGrid";
import Footer from "../components/Footer";

const Game = () => {
  return (
    <div>
      <h1 className="flex items-center justify-center text-3xl font-bold ">
        Snake Game
      </h1>
      <div className="flex items-center justify-center mt-10 mb-10 ">
        <SnakeGrid />
      </div>
      <div className="flex justify-between ">
        <Link href="/hub">
          <ArrowLeft className="size-9 " />
        </Link>
      </div>
      <Footer />
    </div>
  );
};

export default Game;
