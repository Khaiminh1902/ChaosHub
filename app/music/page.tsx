"use client";

import { Button } from "@/components/ui/button";
import { MusicIcon } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { Input } from "@/components/ui/input";

type MusicFile = {
  id: string;
  name: string;
  url: string;
};

export default function Music() {
  const { user } = useUser();
  const [files, setFiles] = useState<MusicFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // Add ref for the input

  useEffect(() => {
    if (user) {
      fetchMusicFiles();
    }
  }, [user]);

  async function fetchMusicFiles() {
    try {
      const response = await fetch("/api/music");
      if (!response.ok) {
        throw new Error("Failed to fetch music files");
      }
      const data = await response.json();
      setFiles(data);
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message);
    }
  }

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    console.log("handleUpload triggered", event.target.files);
    try {
      setUploading(true);
      setError(null);

      if (!user) {
        setError("Please sign in to upload files.");
        return;
      }

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("Please select a file to upload.");
      }

      const file = event.target.files[0];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", user.id);

      const response = await fetch("/api/music", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      await fetchMusicFiles();
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleRename(
    fileId: string,
    oldName: string,
    newName: string
  ) {
    if (!newName) {
      setError("New name cannot be empty.");
      return;
    }

    try {
      const response = await fetch("/api/music", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldName, newName, userId: user?.id }),
      });

      if (!response.ok) {
        throw new Error("Failed to rename file");
      }

      await fetchMusicFiles();
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message);
    }
  }

  async function handleDelete(fileName: string) {
    try {
      const response = await fetch("/api/music", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete file");
      }

      await fetchMusicFiles();
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message);
    }
  }

  return (
    <div className="w-[100%] md:w-[40%] border-t-2 border-b-2 border-r-2 border-[#D2D2D2] flex flex-col overflow-visible">
      <div className="flex justify-center pt-4 text-lg font-semibold gap-2">
        Upload your music <MusicIcon />
      </div>
      <div className="flex justify-center pb-4">
        <div>
          <Button
            className="hover:cursor-pointer bg-gray-800 text-white font-extrabold py-5 px-12 rounded-md border-2 bg-gradient-to-t to-black from-[#8C8C8C] mt-6"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()} // Trigger input click
          >
            {uploading ? "Uploading..." : "Upload"}
          </Button>
          <Input
            ref={fileInputRef} // Attach ref to input
            id="music-upload"
            type="file"
            accept="audio/mpeg,audio/wav"
            onChange={(e) => {
              console.log("Input onChange triggered", e.target.files);
              handleUpload(e);
            }}
            className="hidden"
          />
        </div>
      </div>
      {error && <div className="text-red-500 text-center">{error}</div>}
      <div className="pt-6 px-4">
        <h3 className="font-semibold">Your Music</h3>
        {files.length === 0 ? (
          <p>No music files uploaded yet.</p>
        ) : (
          <ul className="space-y-4">
            {files.map((file) => (
              <li key={file.id} className="border p-4 rounded-md">
                <div className="flex justify-between items-center">
                  <div>
                    <p>{file.name.split("/").pop()}</p>
                    <audio controls src={file.url} className="mt-2">
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        const newName = prompt(
                          "Enter new file name:",
                          file.name.split("/").pop()
                        );
                        if (newName) {
                          handleRename(file.id, file.name, newName);
                        }
                      }}
                      variant="outline"
                    >
                      Rename
                    </Button>
                    <Button
                      onClick={() => handleDelete(file.name)}
                      variant="destructive"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
