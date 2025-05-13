import React from "react";
import Music from "../music/page";
import Tracker from "../components/Tracker";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const Home = () => {
  return (
    <div>
      <span className="text-3xl flex justify-center font-bold">
        Learn Track
      </span>
      <div className="flex mt-12 flex-col md:flex-row">
        <Music />
        <Tracker />
      </div>
      <div className="flex justify-end p-2">
        <Link href="/leaderboard">
          <ArrowRight className="size-9" />
        </Link>
      </div>
    </div>
  );
};

export default Home;
