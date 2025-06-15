/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React, { useState, useEffect } from 'react';
import { Music } from '../../../types/music';

const MusicLibrary = ({ userId = 'user1' }: { userId?: string }) => {
  const [musicList, setMusicList] = useState<Music[]>([]);

  useEffect(() => {
    fetch('/api/music')
      .then((res) => res.json())
      .then((data) => setMusicList(data));
  }, []);

  const selectMusic = async (musicId: string) => {
    try {
      const res = await fetch('/api/music/select', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ musicId, userId }),
      });
      if (res.ok) {
        alert('Music selected!');
        window.location.href = '/';
      } else {
        alert('Failed to select music');
      }
    } catch (error) {
      alert('Error selecting music');
    }
  };

  return (
    <div>
      <span className="flex text-center justify-center mt-10 text-3xl font-bold">Music Library</span>
      <div>
        List of music:
        <ul className="mt-4">
          {musicList.map((music) => (
            <li key={music.id} className="flex items-center gap-4 p-2 border-b">
              <span>
                {music.title} by {music.artist} ({music.genre})
              </span>
              <button
                onClick={() => selectMusic(music.id)}
                className="p-1 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Select
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MusicLibrary;