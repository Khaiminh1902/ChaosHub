import React from 'react';
import CardTop from "../img/card-top.jpg";
import Images from "../img/images.jpeg"
import Sunset from "../img/sunset.jpg"
import Lake from "../img/Nq1z7B.jpg"
import Image from 'next/image';
import Link from 'next/link';

const TechniquesCard = () => {
  return (
    <div className='flex items-center justify-center'>
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-10 gap-12 px-4 text-center'>
      <Link href="/pomodoro/techniques/20-5" className="max-w-sm rounded-md overflow-hidden shadow-lg ">
        <Image className="w-full" src={CardTop} alt="Sunset in the mountains" />
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2">The 20-5 Technique (Pomodoro)</div>
          <p className="text-gray-700 text-base ">
            Grind 20 minutes, slack off 5. 
          </p>
        </div>
      </Link>
      <Link href="/pomodoro/techniques/50-10" className="max-w-sm rounded-md overflow-hidden shadow-lg">
        <Image className="w-full" src={Images} alt="Sunset in the mountains" />
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2">The 50-10 Technique (Pomodoro)</div>
          <p className="text-gray-700 text-base ">
            Hustle 50 minutes, chill 10. 
          </p>
        </div>
      </Link>
      <Link href="/pomodoro/techniques/90-20" className="max-w-sm rounded-md overflow-hidden shadow-lg">
        <Image className="w-full" src={Sunset} alt="Sunset in the mountains" />
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2">The 90-20 Technique (Pomodoro)</div>
          <p className="text-gray-700 text-base ">
            Power through 90 minutes, crash for 20.
          </p>
        </div>
      </Link>
      <Link href="/pomodoro/techniques/custom" className="max-w-sm rounded-md overflow-hidden shadow-lg ">
        <Image className="w-full" src={Lake} alt="Sunset in the mountains" />
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2">Custom (Pomodoro)</div>
          <p className="text-gray-700 text-base">
            Pick work, pick break - DIY 
          </p>
        </div>
      </Link>
    </div>
    </div>
  );
};

export default TechniquesCard;