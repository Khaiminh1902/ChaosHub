"use client";

import React, { useState } from "react";
import { Copyright, Facebook, Slack } from "lucide-react";
import Link from "next/link";
import { RxDiscordLogo } from "react-icons/rx";

const Footer = () => {
  const [isSlackModalOpen, setIsSlackModalOpen] = useState(false);
  const [isDiscordModalOpen, setIsDiscordModalOpen] = useState(false);

  const handleSlackClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.preventDefault();
    setIsSlackModalOpen(true);
  };

  const handleDiscordClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.preventDefault();
    setIsDiscordModalOpen(true);
  };

  const closeSlackModal = () => {
    setIsSlackModalOpen(false);
  };

  const closeDiscordModal = () => {
    setIsDiscordModalOpen(false);
  };

  return (
    <div className="dark:bg-white dark:text-black text-white bg-black flex-col md:flex-row flex justify-between p-3">
      <div className="flex justify-center items-center">
        <span className="text-2xl p-3 font-bold">ChaosHub</span>
      </div>
      <div className="gap-1 font-semibold text-sm flex justify-center items-center p-2">
        <Copyright height={20} />
        <span>2025. All rights reserved.</span>
      </div>
      <div className="text-sm items-center justify-center flex p-3 gap-2">
        <Link
          href="#"
          className="flex gap-1 p-1 items-center font-semibold"
          onClick={handleSlackClick}
        >
          <Slack />
          <span>Slack</span>
        </Link>
        <Link
          href="#"
          className="flex gap-1 p-1 items-center font-semibold"
          onClick={handleDiscordClick}
        >
          <RxDiscordLogo className="text-2xl" />
          <span>Discord</span>
        </Link>
        <Link
          href="https://www.facebook.com/nguyen.khai.minh.816819/"
          className="flex gap-1 p-1 items-center font-semibold"
        >
          <Facebook />
          <span>Facebook</span>
        </Link>
      </div>

      {isSlackModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div
            className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg animate-modal-exit"
            style={{
              animation: isSlackModalOpen
                ? "modal 0.3s ease-out forwards"
                : "modal-exit 0.3s ease-in forwards",
            }}
          >
            <h2 className="text-lg font-bold mb-4 text-black">Slack ID</h2>
            <p className="text-gray-700">Here is my Slack ID: U08RZJCGYSD</p>
            <button
              onClick={closeSlackModal}
              className="mt-4 bg-blue-600 cursor-pointer text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {isDiscordModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div
            className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg animate-modal-exit"
            style={{
              animation: isDiscordModalOpen
                ? "modal 0.3s ease-out forwards"
                : "modal-exit 0.3s ease-in forwards",
            }}
          >
            <h2 className="text-lg font-bold mb-4 text-black">
              Discord Username
            </h2>
            <p className="text-gray-700">My username is: Khai-Minh Nguyen</p>
            <button
              onClick={closeDiscordModal}
              className="mt-4 bg-blue-600 cursor-pointer text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Footer;
