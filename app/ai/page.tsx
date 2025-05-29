/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Textarea } from "@/components/ui/textarea";
import React from "react";
import { useChat } from "@ai-sdk/react";

const page = () => {
  const { messages, handleSubmit, input, handleInputChange } = useChat();
  return (
    <main className="flex items-end h-screen justify-center w-full">
      <div className="container w-full flex flex-col py-8 ">
        <div className="flex-1 overflow-y-auto"></div>
        <form onSubmit={handleSubmit} className="mt-auto relative">
          <Textarea
            className="w-full text-lg"
            placeholder="Say something"
            value={input}
            onChange={handleInputChange}
          />
        </form>
      </div>
    </main>
  );
};

export default page;
