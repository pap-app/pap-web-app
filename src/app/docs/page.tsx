import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function page() {
  return (
    <div>
    <div  className=' w-full flex items-center justify-center  border h-screen  mx-auto'>
      <div className='flex flex-col items-center justify-center space-y-3 w-full '>
         <h1 className='font-bold text-3xl md:text-6xl '>Coming soon..</h1>
         <Image   src={`/img/building.svg`}  width={100} height={100} alt='building sketh' className='w-64  ' />
         <Link href={`/dashboard`} className='py-2 px-6 rounded-xl border my-4'>Home</Link>
      </div>

    </div>
      
    </div>
  )
}
