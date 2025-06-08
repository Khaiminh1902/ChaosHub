/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import useUser from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import Footer from "../components/Footer";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function Home() {
  const { fullName, setFullName } = useUser();
  const [roomID, setRoomID] = useState("");
  const router = useRouter();

  useEffect(() => {
    setFullName("");
  }, []);
  return (
    <div className="w-full">
      <section className=" text-white">
        <div className="mx-auto max-w-screen-xl px-4 py-32 flex-col gap-24 flex items-center">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-black bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text  font-extrabold dark:text-transparent text-5xl">
              {`Create or Join a Hub`}
            </h1>
            <h1 className="text-black dark:bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text font-extrabold dark:text-transparent text-5xl">
              <span className="block">to Meet with your Team</span>
            </h1>
            <div className="flex items-center justify-center gap-4 mt-40">
              <input
                type="text"
                id="name"
                onChange={(e) => setFullName(e.target.value.toString())}
                className="border border-black dark:border-white rounded-md focus:border-transparent focus:outline-none focus:ring-0 px-4 py-2 w-full text-black dark:text-white"
                placeholder="Enter your name "
              />
            </div>

            {fullName && fullName.length >= 3 && (
              <div>
                <div className=" flex items-center justify-center gap-4 mt-6 ">
                  <input
                    type="text"
                    id="roomid"
                    value={roomID}
                    onChange={(e) => setRoomID(e.target.value)}
                    className="border border-black dark:border-white rounded-md focus:border-transparent focus:outline-none focus:ring-0 px-4 py-2 w-full text-black dark:text-white"
                    placeholder="Enter room ID to join a meeting "
                  />
                  <button
                    className="rounded-md bg-blue-600 hover:bg-blue-500 cursor-pointer px-10 py-[11px] text-sm font-medium text-white focus:outline-none sm:w-auto"
                    onClick={() => router.push(`/room/${roomID}`)}
                    disabled={!roomID}
                  >
                    Join
                  </button>
                </div>
                <div className="mt-4 flex items-center justify-center">
                  <button
                    className="text-blue-500 text-sm cursor-pointer font-medium hover:text-blue-400 hover:underline"
                    onClick={() => router.push(`/room/${uuid()}`)}
                  >
                    Or create a new meeting
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      <div className="mt-40">
        <div className="flex justify-between mt-10 relative z-10 items-end">
          <Link href="/ai">
            <ArrowLeft className="size-9" />
          </Link>
          <Link href="/game">
            <ArrowRight className="size-9" />
          </Link>
        </div>
        <Footer />
      </div>
    </div>
  );
}
