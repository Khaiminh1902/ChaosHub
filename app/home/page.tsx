import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import MusicUpload from "../music/page";
import Footer from "../components/Footer";
import Goals from "../components/SetGoals";

const Home = () => {
  return (
    <div>
      <span className="text-3xl flex justify-center font-bold ">
        Music
      </span>
      <MusicUpload />
      <Goals />
      <div className="flex justify-end p-2">
        <Link href="/pomodoro">
          <ArrowRight className="size-9" />
        </Link>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
