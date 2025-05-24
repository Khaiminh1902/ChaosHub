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

const Goals: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [content, setContent] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [showInvalidModal, setShowInvalidModal] = useState<boolean>(false);
  const [showCompleteModal, setShowCompleteModal] = useState<Goal | null>(null);

  useEffect(() => {
    try {
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
    } catch (error) {
      console.error("Error loading goals from localStorage:", error);
      localStorage.setItem("goals", JSON.stringify([]));
      setGoals([]);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("goals", JSON.stringify(goals));
    } catch (error) {
      console.error("Error saving goals to localStorage:", error);
    }
  }, [goals]);

  useEffect(() => {
    return () => {
      try {
        localStorage.setItem("goals", JSON.stringify(goals));
      } catch (error) {
        console.error("Error saving goals on unmount:", error);
      }
    };
  }, [goals]);

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

  return (
    <div className="h-screen flex flex-col mt-16">
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

      <div className=""></div>

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
