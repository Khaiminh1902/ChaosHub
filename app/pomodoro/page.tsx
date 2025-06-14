import React from 'react'
import Footer from "../components/Footer";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import TechniquesCard from './techniquesCard';

const Techniques = () => {
  return (
    <div>
      <span className='text-3xl font-bold flex justify-center text-center items-center mt-24 mb-14'>Pomodoro Techniques</span>
      <TechniquesCard />
      <div className="mt-40">
        <div className="flex justify-between mt-10 z-10 items-end">
          <Link href="/">
            <ArrowLeft className="size-9" />
          </Link>
          <Link href="/ai">
            <ArrowRight className="size-9" />
          </Link>
        </div>
        <Footer />
      </div>
    </div>
  )
}

export default Techniques