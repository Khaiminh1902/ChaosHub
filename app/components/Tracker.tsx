"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export default function Home() {
  const [progress, setProgress] = useState(0);
  const [rebirths, setRebirths] = useState(0);
  const [isStudying, setIsStudying] = useState(false);
  const [studyTime, setStudyTime] = useState(0); // Time in seconds
  const [showResetPopup, setShowResetPopup] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load saved state from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem("studyProgress");
    const savedRebirths = localStorage.getItem("studyRebirths");
    const savedStudyTime = localStorage.getItem("studyTime");
    if (savedProgress) setProgress(parseFloat(savedProgress));
    if (savedRebirths) setRebirths(parseInt(savedRebirths));
    if (savedStudyTime) setStudyTime(parseInt(savedStudyTime));
  }, []);

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem("studyProgress", progress.toString());
    localStorage.setItem("studyRebirths", rebirths.toString());
    localStorage.setItem("studyTime", studyTime.toString());
  }, [progress, rebirths, studyTime]);

  // Stop studying, memoized with useCallback
  const stopStudying = useCallback(() => {
    if (isStudying) {
      setIsStudying(false);
    }
  }, [isStudying]);

  // Handle study timer and progress updates
  useEffect(() => {
    if (isStudying) {
      timerRef.current = setInterval(() => {
        setStudyTime((prev) => {
          const newTime = prev + 10; // Increment by 10 seconds per tick
          // 100% progress = 1 hour = 3,600 seconds
          // 1% = 36 seconds, 0.1% = 3.6 seconds, 0.01% = 0.36 seconds
          const newProgress = (newTime / 3600) * 100;
          if (newProgress >= 100) {
            setProgress(100);
            stopStudying(); // Stop timer at 100%
            return newTime;
          }
          setProgress(newProgress);
          return newTime;
        });
      }, 10000); // Update every 10 seconds
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isStudying, stopStudying]);

  // Start studying
  const startStudying = () => {
    if (!isStudying) {
      setIsStudying(true);
    }
  };

  // Rebirth
  const rebirth = () => {
    setProgress(0);
    setStudyTime(0);
    setRebirths((prev) => prev + 1);
  };

  // Reset all progress
  const resetProgress = () => {
    setProgress(0);
    setStudyTime(0);
    setRebirths(0);
    setShowResetPopup(false);
    stopStudying();
    localStorage.clear();
  };

  return (
    <div className="py-10 w-full flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-extrabold mb-6 text-center text-gray-800">
          Study Tracker
        </h1>
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={startStudying}
            disabled={isStudying || progress >= 100}
            className={`px-6 py-3 rounded-lg text-white transition duration-300 ${
              isStudying || progress >= 100
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            Start Studying
          </button>
          <button
            onClick={stopStudying}
            disabled={!isStudying}
            className={`px-6 py-3 rounded-lg text-white transition duration-300 ${
              !isStudying
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            Stop Studying
          </button>
        </div>
        <div className="mt-6">
          <p className="text-lg font-semibold text-gray-800">
            Progress: <span>{progress.toFixed(2)}%</span>
          </p>
          <div className="w-full bg-gray-200 rounded-full h-5 mt-2">
            <div
              className="bg-gradient-to-r from-green-400 to-green-600 h-5 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        <div className="mt-4 text-center">
          <p className="text-xl font-bold text-gray-800">
            Rebirths:{" "}
            <span className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full">
              {rebirths}
            </span>
          </p>
        </div>
        {progress >= 100 && (
          <button
            onClick={rebirth}
            className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition duration-300"
          >
            Rebirth
          </button>
        )}
        <button
          onClick={() => setShowResetPopup(true)}
          className="w-full mt-4 bg-gray-600 text-white p-3 rounded-lg hover:bg-gray-700 transition duration-300"
        >
          Reset Progress
        </button>
        {/* Reset Confirmation Popup */}
        {showResetPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full animate-fade-in">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Confirm Reset
              </h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to reset all progress? This action cannot
                be undone.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowResetPopup(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={resetProgress}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
