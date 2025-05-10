import React from "react";
import Music from "../music/page";
import Tracker from "../components/Tracker";

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
    </div>
  );
};

export default Home;
