"use client";

import { Button } from "@/components/ui/button";
import { MusicIcon } from "lucide-react";
import Link from "next/link";
import React, { useRef } from "react";

const Music = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === "audio/mpeg") {
        console.log("Selected file:", file);
      } else {
        alert("Please upload an MP3 file.");
      }
    }
  };

  return (
    <div className="w-[100%] md:w-[50%] border-t-2 border-b-2 border-r-2 border-[#D2D2D2] flex flex-col overflow-visible">
      <div className="flex justify-center pt-4 text-lg font-semibold gap-2">
        Upload your music <MusicIcon />
      </div>
      <div className="flex-1"></div>
      <div className="flex justify-center pb-4">
        <input
          type="file"
          accept="audio/mpeg"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        <Link href="/" onClick={handleButtonClick}>
          <Button className="hover:cursor-pointer bg-gray-800 text-white font-extrabold py-5 px-12 rounded-md border-2 bg-gradient-to-t to-black from-[#8C8C8C] mt-6">
            Upload
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Music;
