import React from "react";
import Link from "next/link";
import { ArrowLeft, SendHorizonal } from "lucide-react";
import { Input } from "@/components/ui/input";

const Explore = () => {
  return (
    <div>
      <div>Change the AI Model</div>
      <div className="flex items-center gap-2 p-4">
        <Input
          placeholder="Chat with the AI"
          className="placeholder:text-gray-400"
        />
        <SendHorizonal className="border rounded-md h-9 w-9 p-[7px] hover:bg-blue-400 bg-blue-500 cursor-pointer" />
      </div>
      <div className="flex justify-between mt-10 relative z-10 items-end">
        <Link href="/ai">
          <ArrowLeft className="size-9" />
        </Link>
      </div>
    </div>
  );
};

export default Explore;
