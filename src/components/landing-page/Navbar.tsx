import Link from 'next/link'
import React from 'react'
import { ModeToggle } from '../switch-theme'
import Image from 'next/image'

export default function Navbar() {
  return (
    <div  className=' w-full sticky top-0 bg-background border-b border-border h-[60px] mb-2  flex items-center justify-center z-40  px-4'>
     <div className='max-w-7xl mx-auto w-full flex items-center justify-between'>
        <div className='flex items-center space-x-1'>
        <Image src={`/img/logo.png`} width={60} height={60} alt='logo' className='w-9 h-9 rounded-full'  />
        <p className='font-bold'>MunaPay</p>

        </div>
         <div>
           
            <Link href={`/login`} className='border p-2 rounded-xl'>
              Get started
            </Link>
         </div>
         </div>
      
    </div>
  )
}
