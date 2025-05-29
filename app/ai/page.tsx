import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";

const page = () => {
  return (
    <div>
      <div className="flex flex-col">
        <span className="font-bold text-2xl flex items-center justify-center mt-20 bg-gradient-to-l from-blue-500 to-purple-500 text-transparent bg-clip-text">
          CREATE A NEW ACCOUNT TO CHAT WITH AN AI
        </span>
        <Link href="/ai/chat">
          <Button>Log In with Existing Account</Button>
        </Link>

        <Button>Create a New Account</Button>
      </div>
      <div className="mt-40">
        <div className="flex justify-between mt-10 relative z-10 items-end">
          <Link href="/">
            <ArrowLeft className="size-9" />
          </Link>
          <Link href="/hub">
            <ArrowRight className="size-9" />
          </Link>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default page;
