"use client";

import { Button } from "@/components/ui/button";
import { MusicIcon } from "lucide-react";
import Dropzone from "react-dropzone";

const Music = () => {
  return (
    <Dropzone onDrop={(acceptedFiles) => console.log(acceptedFiles)}>
      {({ getRootProps, getInputProps }) => (
        <div className="w-[100%] md:w-[40%] border-t-2 border-b-2 border-r-2 border-[#D2D2D2] flex flex-col overflow-visible">
          <div className="flex justify-center pt-4 text-lg font-semibold gap-2">
            Upload your music <MusicIcon />
          </div>
          <input {...getInputProps()} className="bg-red-500" />
          <div className="flex justify-center pb-4">
            <Button
              {...getRootProps()}
              className="hover:cursor-pointer bg-gray-800 text-white font-extrabold py-5 px-12 rounded-md border-2 bg-gradient-to-t to-black from-[#8C8C8C] mt-6"
            >
              Upload
            </Button>
          </div>
          <div className="pt-6">Music appear here</div>
        </div>
      )}
    </Dropzone>
  );
};

export default Music;
