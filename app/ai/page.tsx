import React from 'react'
import Footer from "../components/Footer";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Chat from '../components/chat';


const page = () => {
  return (
    <div>
      <h1 className="flex items-center justify-center text-3xl font-bold mt-20 ">
        Chat with AI 
      </h1>
      <Chat />
    <div className="mt-40">
        <div className="flex justify-between mt-10 z-10 items-end ">
          <Link href="/learning">
            <ArrowLeft className="size-9" />
          </Link>
          <Link href="/hub">
            <ArrowRight className="size-9" />
          </Link>
        </div>
        <Footer />
      </div>
    </div>
  )
}

export default page