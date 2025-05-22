import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

const Goals = () => {
  return (
    <div>
      Goals
      <div className="flex justify-between">
        <Link href="/">
          <ArrowLeft className="size-9" />
        </Link>
        <Link href="/hub">
          <ArrowRight className="size-9" />
        </Link>
      </div>
    </div>
  );
};

export default Goals;
