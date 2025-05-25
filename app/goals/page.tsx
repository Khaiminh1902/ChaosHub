/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState, useEffect, FormEvent } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Footer from "../components/Footer";

interface Goal {
  id: number;
  content: string;
  duration: number;
  status: "pending" | "running" | "stopped";
  remainingTime: number;
  startTimestamp?: number;
}

interface StreakDay {
  date: string; // ISO date string (YYYY-MM-DD)
  completed: boolean;
}

const Goals: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [content, setContent] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [showInvalidModal, setShowInvalidModal] = useState<boolean>(false);
  const [showCompleteModal, setShowCompleteModal] = useState<Goal | null>(null);
  const [streakDays, setStreakDays] = useState<StreakDay[]>([]);

  // Helper function to generate 90-day streak array
  const initializeStreakDays = (startDate: Date): StreakDay[] => {
    const days: StreakDay[] = [];
    for (let i = 0; i < 90; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push({
        date: date.toISOString().split("T")[0],
        completed: false,
      });
    }
    return days;
  };

  // Load goals and streak data from localStorage
  useEffect(() => {
    try {
      // Load goals
      const savedGoals = localStorage.getItem("goals");
      if (savedGoals) {
        const parsedGoals = JSON.parse(savedGoals);
        if (
          Array.isArray(parsedGoals) &&
          parsedGoals.every(
            (goal: any) =>
              typeof goal.id === "number" &&
              typeof goal.content === "string" &&
              typeof goal.duration === "number" &&
              ["pending", "running", "stopped"].includes(goal.status) &&
              typeof goal.remainingTime === "number" &&
              (goal.startTimestamp === undefined ||
                typeof goal.startTimestamp === "number")
          )
        ) {
          const updatedGoals: Goal[] = parsedGoals.map((goal: Goal) => {
            if (
              goal.status === "running" &&
              goal.remainingTime > 0 &&
              goal.startTimestamp
            ) {
              const now = Date.now();
              const elapsedSeconds = Math.floor(
                (now - goal.startTimestamp) / 1000
              );
              const newRemainingTime = Math.max(
                0,
                goal.remainingTime - elapsedSeconds
              );
              if (newRemainingTime <= 0) {
                setShowCompleteModal({
                  ...goal,
                  remainingTime: 0,
                  status: "stopped",
                });
                return {
                  ...goal,
                  remainingTime: 0,
                  status: "stopped",
                  startTimestamp: undefined,
                };
              }
              return {
                ...goal,
                remainingTime: newRemainingTime,
                startTimestamp: now,
              };
            }
            return goal;
          });
          setGoals(updatedGoals);
        } else {
          console.warn(
            "Invalid goals data in localStorage, resetting to empty array"
          );
          localStorage.setItem("goals", JSON.stringify([]));
          setGoals([]);
        }
      } else {
        localStorage.setItem("goals", JSON.stringify([]));
        setGoals([]);
      }

      // Load streak data
      const savedStreak = localStorage.getItem("streak");
      let newStreak: StreakDay[] = initializeStreakDays(new Date());
      if (savedStreak) {
        try {
          const parsedStreak = JSON.parse(savedStreak);
          if (
            Array.isArray(parsedStreak) &&
            parsedStreak.length > 0 &&
            parsedStreak.every(
              (day: any) =>
                typeof day.date === "string" &&
                typeof day.completed === "boolean"
            )
          ) {
            const firstDate = new Date(parsedStreak[0].date);
            if (isNaN(firstDate.getTime())) {
              console.warn("Invalid first date in streak, resetting");
              localStorage.setItem("streak", JSON.stringify(newStreak));
              setStreakDays(newStreak);
            } else {
              const now = new Date();
              const daysDiff = Math.floor(
                (now.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)
              );
              if (daysDiff >= 90) {
                // Reset streak after 90 days
                localStorage.setItem("streak", JSON.stringify(newStreak));
                setStreakDays(newStreak);
              } else {
                setStreakDays(parsedStreak);
              }
            }
          } else {
            console.warn(
              "Invalid streak data in localStorage, resetting to new streak"
            );
            localStorage.setItem("streak", JSON.stringify(newStreak));
            setStreakDays(newStreak);
          }
        } catch (parseError) {
          console.warn("Error parsing streak data, resetting to new streak");
          localStorage.setItem("streak", JSON.stringify(newStreak));
          setStreakDays(newStreak);
        }
      } else {
        localStorage.setItem("streak", JSON.stringify(newStreak));
        setStreakDays(newStreak);
      }
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
      localStorage.setItem("goals", JSON.stringify([]));
      localStorage.setItem(
        "streak",
        JSON.stringify(initializeStreakDays(new Date()))
      );
      setGoals([]);
      setStreakDays(initializeStreakDays(new Date()));
    }
  }, []);

  // Save goals and streak data to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("goals", JSON.stringify(goals));
      localStorage.setItem("streak", JSON.stringify(streakDays));
    } catch (error) {
      console.error("Error saving data to localStorage:", error);
    }
  }, [goals, streakDays]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      try {
        localStorage.setItem("goals", JSON.stringify(goals));
        localStorage.setItem("streak", JSON.stringify(streakDays));
      } catch (error) {
        console.error("Error saving data on unmount:", error);
      }
    };
  }, [goals, streakDays]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const durationNum = parseFloat(duration);
    if (content.trim() && !isNaN(durationNum) && durationNum > 0) {
      setGoals([
        ...goals,
        {
          id: Date.now(),
          content,
          duration: durationNum,
          status: "pending",
          remainingTime: durationNum * 60,
        },
      ]);
      setContent("");
      setDuration("");
    } else {
      setShowInvalidModal(true);
    }
  };

  const handleStatus = (id: number, currentStatus: Goal["status"]) => {
    setGoals(
      goals.map((goal) =>
        goal.id === id
          ? {
              ...goal,
              status: currentStatus === "running" ? "stopped" : "running",
              startTimestamp:
                currentStatus === "running" ? undefined : Date.now(),
            }
          : goal
      )
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setGoals((prevGoals) =>
        prevGoals.map((goal) => {
          if (goal.status === "running" && goal.remainingTime > 0) {
            const newRemainingTime = goal.remainingTime - 1;
            if (newRemainingTime <= 0) {
              setShowCompleteModal({
                ...goal,
                remainingTime: 0,
                status: "stopped",
              });
              // Update streak for today when goal completes
              const today = new Date().toISOString().split("T")[0];
              setStreakDays((prevStreak) =>
                prevStreak.map((day) =>
                  day.date === today ? { ...day, completed: true } : day
                )
              );
              return {
                ...goal,
                remainingTime: 0,
                status: "stopped",
                startTimestamp: undefined,
              };
            }
            return { ...goal, remainingTime: newRemainingTime };
          }
          return goal;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleCompleteModalClose = () => {
    if (showCompleteModal) {
      setGoals(goals.filter((goal) => goal.id !== showCompleteModal.id));
      setShowCompleteModal(null);
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}m ${secs.toString().padStart(2, "0")}s`;
  };

  // Render streak table (GitHub style)
  const renderStreakTable = () => {
    if (!streakDays || streakDays.length === 0) {
      return <div className="text-center text-gray-600">Loading streak...</div>;
    }

    const today = new Date().toISOString().split("T")[0];
    const weeks: StreakDay[][] = [];
    for (let i = 0; i < streakDays.length; i += 7) {
      weeks.push(streakDays.slice(i, i + 7));
    }

    return (
      <div className="w-full max-w-4xl mx-auto mt-8">
        <h2 className="text-2xl font-bold text-black dark:text-white text-center mb-4">
          90-Day Streak
        </h2>
        <div className="flex flex-col items-center">
          <div className="flex gap-0">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-0">
                {week.map((day, dayIndex) => (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className={`w-6 h-6 border border-gray-300 ${
                      day.date === today
                        ? "bg-blue-300 border-blue-500"
                        : day.completed
                        ? "bg-green-500 border-green-600"
                        : "bg-gray-100 border-gray-300"
                    }`}
                    title={day.date}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col mt-16">
      <h1 className="text-3xl font-bold dark:text-white text-black text-center mb-6">
        Set Your Goals
      </h1>
      <form
        onSubmit={handleSubmit}
        className="w-[350px] mx-auto bg-white p-6 rounded-lg shadow-md mb-10"
      >
        <div className="mb-4">
          <label
            htmlFor="content"
            className="block text-sm font-medium text-black"
          >
            Content
          </label>
          <input
            type="text"
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mt-1 block w-full rounded-md placeholder:text-gray-400 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
            placeholder="Enter goal content"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="duration"
            className="block text-sm font-medium text-black"
          >
            Duration (in minutes)
          </label>
          <input
            type="text"
            id="duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm placeholder:text-gray-400 focus:border-indigo-500 focus:ring-indigo-500 p-2"
            placeholder="Enter amount of minutes"
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
        >
          Set Goal
        </Button>
      </form>

      {showInvalidModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold text-black mb-4">
              Invalid Duration
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Please enter a valid number for the duration in minutes.
            </p>
            <Button
              onClick={() => setShowInvalidModal(false)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Close
            </Button>
          </div>
        </div>
      )}

      {showCompleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold text-black mb-4">
              Goal Completed!
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              The goal "{showCompleteModal.content}" has been completed!!!
              🎉🎉🎉
            </p>
            <Button
              onClick={handleCompleteModalClose}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
            >
              Close
            </Button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-4 relative z-10">
        {goals.map((goal) => (
          <div
            key={goal.id}
            className={`p-4 rounded-lg shadow-md border ${
              goal.status === "running"
                ? "bg-green-50 border-green-200"
                : goal.status === "stopped"
                ? "bg-red-50 border-red-200"
                : "bg-white border-gray-200"
            } w-80`}
          >
            <div className="text-lg font-medium text-black">
              Content: {goal.content}
            </div>
            <div className="text-sm text-gray-600">
              Duration: {formatTime(goal.remainingTime)}
            </div>
            <div className="mt-4 flex gap-2">
              <Button
                onClick={() => handleStatus(goal.id, goal.status)}
                className={`${
                  goal.status === "running"
                    ? "bg-red-600 hover:bg-red-700 cursor-pointer"
                    : "bg-green-600 hover:bg-green-700 cursor-pointer"
                } text-white`}
                disabled={goal.remainingTime <= 0}
              >
                {goal.status === "running" ? "Stop" : "Start"}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {renderStreakTable()}

      <div className="flex justify-between mt-10 relative z-10 items-end">
        <Link href="/">
          <ArrowLeft className="size-9" />
        </Link>
        <Link href="/hub">
          <ArrowRight className="size-9" />
        </Link>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default Goals;
