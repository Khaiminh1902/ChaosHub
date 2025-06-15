'use client';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { Music } from '../../types/music';

const ChooseMusic = ({ userId = 'user1' }: { userId?: string }) => {
  const [selectedMusic, setSelectedMusic] = useState<Music | null>(null);
  const [volume, setVolume] = useState(100);

  useEffect(() => {
    fetch(`/api/music/selected?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => setSelectedMusic(data));
  }, [userId]);

  return (
    <div className="text-gray-600">
      <div>
        Audio volume: {volume}%{' '}
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="w-24"
        />
      </div>
      <div className="flex items-center gap-5">
        <Link href="/music/library">
          <button className="cursor-pointer p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 w-[100px] mt-4 mb-4">
            Choose
          </button>
        </Link>
        <div>
          Chosen Music: {selectedMusic ? `${selectedMusic.title} by ${selectedMusic.artist}` : 'None'}
        </div>
      </div>
    </div>
  );
};

export default ChooseMusic;