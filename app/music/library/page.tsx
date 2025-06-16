'use client';
import React, { useEffect, useState } from 'react';

type Track = {
  title: string;
  duration: string;
  url: string;
};

const Page = () => {
  const [tracks, setTracks] = useState<Track[]>([]);

  useEffect(() => {
    fetch('/music-data.json')
      .then(res => res.json())
      .then(setTracks);
  }, []);

  return (
    <div>
      <span className='flex justify-center mt-10 text-4xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent'>Music Library</span>
      <div className='mt-10 pl-4 flex flex-col gap-10'>
        {tracks.map((track, index) => (
          <div key={index} className='flex flex-col'>
            <span className='text-lg font-bold'>{index + 1}. {track.title}</span>
            <span className='text-sm'>Duration: {track.duration}</span>
            <audio controls className='mt-2'>
              <source src={track.url} type='audio/mpeg' />
              Your browser does not support the audio element.
            </audio>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
