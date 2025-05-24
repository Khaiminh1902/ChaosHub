import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import Footer from "../components/Footer";

const Hub = () => {
  return (
    <div>
      Hub
      <div className="flex justify-between">
        <Link href="/goals">
          <ArrowLeft className="size-9" />
        </Link>
        <Link href="/game">
          <ArrowRight className="size-9" />
        </Link>
      </div>
      <Footer />
    </div>
  );
};

export default Hub;
