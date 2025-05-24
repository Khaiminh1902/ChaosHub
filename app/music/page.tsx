/* eslint-disable react-hooks/exhaustive-deps */
"use client";

/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, ChangeEvent } from "react";
import { useUser } from "@clerk/clerk-react";
import axios, { AxiosResponse } from "axios";
import db from "../../db";

interface Track {
  id?: number;
  userId: string;
  fileName: string;
  cloudinaryUrl: string;
  createdAt: Date;
}

const Modal: React.FC<{
  message: string;
  onClose: () => void;
}> = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
        <p className="text-gray-800 text-lg mb-4">{message}</p>
        <button
          onClick={onClose}
          className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 w-full cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const MusicUpload: React.FC = () => {
  const { isSignedIn, user } = useUser();
  const [file, setFile] = useState<File | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [renameId, setRenameId] = useState<number | null>(null);
  const [newName, setNewName] = useState<string>("");
  const [currentAudio, setCurrentAudio] = useState<{
    audio: HTMLAudioElement;
    trackId: number;
  } | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(1.0);
  const [modal, setModal] = useState<{ show: boolean; message: string }>({
    show: false,
    message: "",
  });

  useEffect(() => {
    if (isSignedIn && user) {
      db.tracks
        .where("userId")
        .equals(user.id)
        .toArray()
        .then((fetchedTracks) => setTracks(fetchedTracks));
    }

    return () => {
      if (currentAudio) {
        currentAudio.audio.pause();
        setCurrentAudio(null);
        setIsPlaying(false);
      }
    };
  }, [isSignedIn, user]);

  useEffect(() => {
    if (currentAudio) {
      currentAudio.audio.volume = volume;
    }
  }, [volume, currentAudio]);
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const maxSize = 10 * 1024 * 1024;
      if (selectedFile.size > maxSize) {
        setModal({
          show: true,
          message: "File cannot exceed 10 MB.",
        });
        setFile(null);
        e.target.value = "";
      } else {
        setFile(selectedFile);
      }
    }
  };

  const handleUpload = async () => {
    if (!file || !isSignedIn || !user) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "music_app_unsigned");
    formData.append("resource_type", "raw");

    try {
      console.log("FormData:", formData);
      const response: AxiosResponse<{
        secure_url: string;
        original_filename: string;
      }> = await axios.post(
        `https://api.cloudinary.com/v1_1/djzlfebzw/raw/upload`,
        formData
      );
      console.log("Upload success:", response.data);
      const { secure_url, original_filename } = response.data;

      const track: Track = {
        userId: user.id,
        fileName: original_filename,
        cloudinaryUrl: secure_url,
        createdAt: new Date(),
      };
      const id = await db.tracks.add(track);
      setTracks([...tracks, { id, ...track }]);
      setFile(null);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const handlePlay = (url: string, trackId: number) => {
    if (currentAudio && currentAudio.trackId === trackId && !isPlaying) {
      currentAudio.audio.play();
      setIsPlaying(true);
    } else {
      if (currentAudio) {
        currentAudio.audio.pause();
      }
      const audio = new Audio(url);
      audio.volume = volume;
      audio.play();
      setCurrentAudio({ audio, trackId });
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (currentAudio && isPlaying) {
      currentAudio.audio.pause();
      setIsPlaying(false);
    }
  };

  const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  const handleRename = async (id: number) => {
    if (newName && renameId === id) {
      await db.tracks.update(id, { fileName: newName });
      setTracks(
        tracks.map((track) =>
          track.id === id ? { ...track, fileName: newName } : track
        )
      );
      setRenameId(null);
      setNewName("");
    }
  };

  const handleDelete = async (id: number, cloudinaryUrl: string) => {
    if (currentAudio && currentAudio.trackId === id) {
      currentAudio.audio.pause();
      setCurrentAudio(null);
      setIsPlaying(false);
    }
    await db.tracks.delete(id);
    setTracks(tracks.filter((track) => track.id !== id));
  };

  const closeModal = () => {
    setModal({ show: false, message: "" });
  };

  if (!isSignedIn) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-lg font-semibold text-gray-700">
          Please sign in to access music uploads.
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 ">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Upload Music</h2>
        <div className="flex items-center space-x-4 mb-6">
          <input
            type="file"
            accept="audio/mp3"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <button
            onClick={handleUpload}
            disabled={!file}
            className={`py-2 px-4 rounded-md font-semibold text-white ${
              file
                ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                : "bg-gray-400 cursor-not-allowed"
            } transition-colors duration-200`}
          >
            Upload
          </button>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Volume: {(volume * 100).toFixed(0)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Your Tracks
        </h3>
        {tracks.length === 0 ? (
          <p className="text-gray-500">No tracks uploaded yet.</p>
        ) : (
          <ul className="space-y-4">
            {tracks.map((track) => (
              <li
                key={track.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-md shadow-sm hover:bg-gray-100 transition-colors duration-200"
              >
                {renameId === track.id ? (
                  <div className="flex items-center space-x-2 w-full">
                    <input
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="New name"
                      className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => handleRename(track.id!)}
                      className="py-1 px-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 cursor-pointer"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setRenameId(null)}
                      className="py-1 px-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between w-full">
                    <span className="text-gray-700 font-medium">
                      {track.fileName}
                    </span>
                    <div className="flex space-x-2">
                      {currentAudio &&
                      currentAudio.trackId === track.id &&
                      isPlaying ? (
                        <button
                          onClick={handlePause}
                          className="py-1 px-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-200 cursor-pointer"
                        >
                          Pause
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            handlePlay(track.cloudinaryUrl, track.id!)
                          }
                          className="py-1 px-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 cursor-pointer"
                        >
                          Play
                        </button>
                      )}
                      <button
                        onClick={() => setRenameId(track.id!)}
                        className="py-1 px-3 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors duration-200 cursor-pointer"
                      >
                        Rename
                      </button>
                      <button
                        onClick={() =>
                          handleDelete(track.id!, track.cloudinaryUrl)
                        }
                        className="py-1 px-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {modal.show && <Modal message={modal.message} onClose={closeModal} />}
    </div>
  );
};

export default MusicUpload;
