"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const LearningPage = () => {
  const [customWorkMinutes, setCustomWorkMinutes] = useState('');
  const [customBreakMinutes, setCustomBreakMinutes] = useState('');
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isBreak, setIsBreak] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    if (timeLeft === null || !isRunning) return;

    if (timeLeft <= 0) {
      if (!isBreak) {
        const breakMinutes = parseInt(customBreakMinutes) || 1;
        setIsBreak(true);
        setTimeLeft(Math.max(breakMinutes * 60, 0));
      } else {
        setIsRunning(false);
        setShowPrompt(true);
      }
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime !== null ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, isRunning, isBreak, customBreakMinutes]);

  const handleStartTimer = () => {
    const workMinutes = parseFloat(customWorkMinutes);
    const breakMinutes = parseFloat(customBreakMinutes);

    const hasDecimalWork = customWorkMinutes.includes('.') || customWorkMinutes.includes(',');
    const hasDecimalBreak = customBreakMinutes.includes('.') || customBreakMinutes.includes(',');
    const isWorkBelowOne = !isNaN(workMinutes) && Math.floor(workMinutes) < 1;
    const isBreakBelowOne = !isNaN(breakMinutes) && Math.floor(breakMinutes) < 1;

    if (hasDecimalWork || hasDecimalBreak || isWorkBelowOne || isBreakBelowOne) {
      let message = 'Invalid input detected:\n';
      if (hasDecimalWork || hasDecimalBreak) message += '- Decimals are not allowed.\n';
      if (isWorkBelowOne) message += '- Work time must be at least 1 minute.\n';
      if (isBreakBelowOne) message += '- Break time must be at least 1 minute.\n';
      message += 'Would you like to use 1 minute as the default, or adjust your input?';
      setModalMessage(message);
      setShowModal(true);
      return;
    }

    const workTime = Math.max(Math.floor(workMinutes), 1) * 60;
    setTimeLeft(workTime);
    setIsRunning(true);
    setIsBreak(false);
    setShowPrompt(false);
    setCustomWorkMinutes('');
    setCustomBreakMinutes('');
  };

  const handleUseDefault = () => {
    setTimeLeft(1 * 60);
    setIsRunning(true);
    setIsBreak(false);
    setShowPrompt(false);
    setShowModal(false);
    setCustomWorkMinutes('');
    setCustomBreakMinutes('');
  };

  const handleAdjustInput = () => {
    setShowModal(false);
  };

  const handleNewCustomSession = () => {
    setTimeLeft(null);
    setIsRunning(false);
    setIsBreak(false);
    setShowPrompt(false);
    setShowModal(false);
    setCustomWorkMinutes('');
    setCustomBreakMinutes('');
  };

  const formattedTime = timeLeft !== null
    ? `${Math.floor(timeLeft / 60)
        .toString()
        .padStart(2, '0')}:${(timeLeft % 60).toString().padStart(2, '0')}`
    : '00:00';

  return (
    <div className="flex items-center justify-center p-4 mt-44 relative">
      <div className="rounded overflow-hidden shadow-lg border p-4 h-[400px] w-full max-w-md">
        <div className="px-6 py-4 flex flex-col h-full">
          <div className="font-bold text-2xl mb-2 text-center">
            {isBreak ? 'Break Time' : 'Custom Timer'}
          </div>
          {showPrompt ? (
            <div className="mt-auto flex flex-col items-center">
              <div className="text-lg mb-4 text-center">
                Break is over! Would you like to set a new timer or choose an existing one?
              </div>
              <div className="flex space-x-4">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
                  onClick={handleNewCustomSession}
                >
                  New Custom Timer
                </button>
                <Link
                  href="/learning"
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
                >
                  Choose Another
                </Link>
              </div>
            </div>
          ) : timeLeft === null && !isRunning ? (
            <div className="flex flex-col items-center justify-center h-full">
              <input
                type="number"
                value={customWorkMinutes}
                onChange={(e) => setCustomWorkMinutes(e.target.value)}
                placeholder="Enter work minutes"
                className="border rounded py-2 px-3 text-gray-700 mb-2 text-center w-[200px]"
                step="1"
                min="1"
              />
              <input
                type="number"
                value={customBreakMinutes}
                onChange={(e) => setCustomBreakMinutes(e.target.value)}
                placeholder="Enter break minutes"
                className="border rounded py-2 px-3 text-gray-700 mb-8 w-[200px] text-center"
                step="1"
                min="1"
              />
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
                onClick={handleStartTimer}
              >
                Start Timer
              </button>
            </div>
          ) : (
            <>
              <div className="text-6xl font-mono text-center flex justify-center items-center h-full">
                {formattedTime}
              </div>
              {isBreak && (
                <div className="text-lg text-gray-600 text-center mt-4">
                  Enjoy your break!
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full text-gray-600">
            <h2 className="text-xl font-bold mb-4 text-center">Invalid Input</h2>
            <p className="text-lg mb-4 text-center whitespace-pre-wrap">{modalMessage}</p>
            <div className="flex space-x-4 justify-center">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
                onClick={handleUseDefault}
              >
                Use 1 Minute
              </button>
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
                onClick={handleAdjustInput}
              >
                Adjust Input
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningPage;