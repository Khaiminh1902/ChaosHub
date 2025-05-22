import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import MusicUpload from "../music/page";
import Tracker from "../components/Tracker";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div>
      <span className="text-3xl flex justify-center font-bold">
        Learn Track
      </span>
      <MusicUpload />
      <Tracker />
      <div className="flex justify-end p-2">
        <Link href="/goals">
          <ArrowRight className="size-9" />
        </Link>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
