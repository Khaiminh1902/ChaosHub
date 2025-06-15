import Link from 'next/link'
import React from 'react'

const ChooseMusic = () => {
  return (
    <div className='text-gray-600'>
        <div>
            Audio volume: 100% 
        </div>
          <div className='flex items-center gap-5'>
          <Link href="/music/library">
              <button className='cursor-pointer p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 w-[100px] mt-4 mb-4'>Choose</button>
          </Link>
          <div>
              Chosen Music: 
          </div>
        </div>
    </div>
  )
}

export default ChooseMusic