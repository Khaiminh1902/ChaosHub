import React from 'react'
import Footer from "../components/Footer";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Input } from '@/components/ui/input';


const page = () => {
  return (
    <div>
      <span className='flex text-3xl items-center justify-center font-bold'>AI CHATBOT  </span>
      <div className='p-5'>
        <Input 
          placeholder='Ask something...'
          className=''
        />
      </div>
    <div className="mt-40">
        <div className="flex justify-between mt-10 z-10 items-end">
          <Link href="/">
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