"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Page = () => {
  const [timeLeft, setTimeLeft] = useState(50 * 60);
  const [isBreak, setIsBreak] = useState(false);
  const [isWorkPromptOpen, setIsWorkPromptOpen] = useState(false);
  const [isBreakPromptOpen, setIsBreakPromptOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (timeLeft <= 0) {
      if (!isBreak) {
        setIsWorkPromptOpen(true);
      } else {
        setIsBreakPromptOpen(true);
      }
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, isBreak]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const handleStartBreak = () => {
    setIsBreak(true);
    setTimeLeft(10 * 60);
    setIsWorkPromptOpen(false);
  };

  const handleNewSession = () => {
    setIsBreak(false);
    setTimeLeft(20 * 60);
    setIsBreakPromptOpen(false);
  };

  const handleChooseAnother = () => {
    router.push('/learning');
  };

  return (
    <div className="flex items-center justify-center p-4 mt-44 relative">
      <div className="rounded overflow-hidden shadow-lg border p-4 h-[400px] w-full max-w-md">
        <div className="px-6 py-4 flex flex-col h-full">
          <div className="font-bold text-2xl mb-2 text-center">
            {isBreak ? 'Break Time' : 'The 50-10 Technique (Pomodoro)'}
          </div>
          <div className="text-6xl font-mono text-center flex justify-center items-center h-full">
            {formattedTime}
          </div>
          {isBreak && !isBreakPromptOpen && (
            <div className="text-lg text-gray-600 text-center mt-4">
              Enjoy your 5-minute break!
            </div>
          )}
          {isBreakPromptOpen && (
            <div className="mt-auto flex flex-col items-center">
              <div className="text-lg mb-4">
                Break is over! Would you like to continue?
              </div>
              <div className="flex space-x-4">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
                  onClick={handleNewSession}
                >
                  Restart 20-Minute Session
                </button>
                <button
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
                  onClick={handleChooseAnother}
                >
                  Choose Another
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {isWorkPromptOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full text-black">
            <h2 className="text-xl font-bold mb-4 text-center">Work Session Complete!</h2>
            <p className="text-lg mb-4 text-center">Would you like to take a break or choose another option?</p>
            <div className="flex space-x-4 justify-center">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
                onClick={handleStartBreak}
              >
                Start Break
              </button>
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
                onClick={handleChooseAnother}
              >
                Choose Another
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;