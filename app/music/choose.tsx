import Link from 'next/link'
import React from 'react'

const ChooseMusic = () => {
  return (
    <div className='text-gray-600'>
        <div className='text-sm font-semibold'>
        </div>
          <div className='flex items-center justify-center'>
          <Link href="/music/library">
              <button className='cursor-pointer p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 w-[200px] mt-1 mb-4 font-bold'>Choose</button>
          </Link>
        </div>
    </div>
  )
}

export default ChooseMusic