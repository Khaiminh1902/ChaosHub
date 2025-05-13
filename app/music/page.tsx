/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Button } from "@/components/ui/button";
import { MusicIcon, Trash2Icon } from "lucide-react";
import { useState, useEffect } from "react";
import Dropzone from "react-dropzone";
import { supabaseClient } from "@/lib/supabaseClient";
import { useUser, useAuth } from "@clerk/nextjs";

interface MusicFile {
  id: string;
  file_name: string;
  file_url: string;
}

const Music = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<MusicFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [supabaseUserId, setSupabaseUserId] = useState<string | null>(null);

  // Set Supabase session with Clerk token and get Supabase user ID
  useEffect(() => {
    if (user) {
      const setAuthToken = async () => {
        try {
          const token = await getToken({ template: "supabase" });
          console.log("Clerk JWT Token:", token); // Log the token for debugging
          if (!token) {
            throw new Error("No Clerk token found");
          }

          const { error: sessionError } = await supabaseClient.auth.setSession({
            access_token: token,
            refresh_token: "",
          });
          if (sessionError) {
            throw new Error(
              "Failed to set Supabase session: " + sessionError.message
            );
          }

          const { data: sessionData, error: userError } =
            await supabaseClient.auth.getUser();
          if (userError || !sessionData.user) {
            throw new Error(
              "Failed to get Supabase user: " + userError?.message
            );
          }

          console.log("Supabase User ID:", sessionData.user.id);
          setSupabaseUserId(sessionData.user.id);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          console.error("Auth setup error:", error.message);
          setFetchError(
            "Failed to authenticate with Supabase: " + error.message
          );
        }
      };
      setAuthToken();
    }
  }, [user, getToken]);

  // Fetch uploaded files from database
  useEffect(() => {
    if (supabaseUserId) {
      const fetchFiles = async () => {
        const { data, error } = await supabaseClient
          .from("music_files")
          .select("id, file_name, file_url")
          .eq("user_id", supabaseUserId);
        if (error) {
          const errorMessage = error.message || "Unknown error";
          console.error("Error fetching files:", errorMessage, error);
          setFetchError(`Failed to fetch files: ${errorMessage}`);
        } else {
          setUploadedFiles(data || []);
          setFetchError(null);
        }
      };
      fetchFiles();
    }
  }, [supabaseUserId]);

  // Handle file drop
  const onDrop = async (acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
    setUploading(true);

    for (const file of acceptedFiles) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const result = await response.json();
        if (response.ok) {
          setUploadedFiles((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              file_name: file.name,
              file_url: result.url,
            },
          ]);
        } else {
          console.error("Upload failed:", result.error);
        }
      } catch (error) {
        console.error("Upload error:", error);
      }
    }

    setFiles([]);
    setUploading(false);
  };

  // Delete file
  const removeFile = async (fileId: string, fileName: string) => {
    try {
      const supabase = supabaseClient;
      const filePath = fileName.split("/").slice(-2).join("/"); // Extract userId/filename

      // Delete from Storage
      const { error: storageError } = await supabase.storage
        .from("music")
        .remove([filePath]);

      if (storageError) {
        throw new Error(storageError.message);
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from("music_files")
        .delete()
        .eq("id", fileId);

      if (dbError) {
        throw new Error(dbError.message);
      }

      setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Delete error:", error.message);
    }
  };

  return (
    <div className="w-full md:w-[40%] mx-auto p-6">
      {fetchError && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {fetchError}
        </div>
      )}
      <Dropzone
        onDrop={onDrop}
        accept={{ "audio/*": [".mp3", ".wav"] }}
        disabled={uploading}
      >
        {({ getRootProps, getInputProps, isDragActive }) => (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${
                isDragActive
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 bg-white"
              }
              ${
                uploading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:border-gray-400"
              }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-4">
              <MusicIcon className="w-12 h-12 text-gray-600" />
              <p className="text-lg font-semibold text-gray-700">
                {uploading
                  ? "Uploading..."
                  : isDragActive
                  ? "Drop your music files here!"
                  : "Drag & drop your music files or click to upload"}
              </p>
              <Button
                className="bg-gradient-to-t from-gray-800 to-black text-white font-bold py-2 px-6 rounded-md"
                disabled={uploading}
              >
                Select Files
              </Button>
            </div>
          </div>
        )}
      </Dropzone>
      <div className="mt-6">
        {uploadedFiles.length > 0 ? (
          <ul className="space-y-2">
            {uploadedFiles.map((file) => (
              <li
                key={file.id}
                className="flex items-center justify-between p-3 bg-gray-100 rounded-md"
              >
                <a
                  href={file.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 truncate max-w-[70%] hover:underline"
                >
                  {file.file_name}
                </a>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(file.id, file.file_url)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2Icon className="w-5 h-5" />
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">
            No music files uploaded yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default Music;
