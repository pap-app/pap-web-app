"use client"

import { navLinks } from '@/utils/constants'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'


  type  Props = {
    
  }

export default function SideBar2() {

    const pathName =  usePathname()
  return (
    <div  className=' md:w-[170px]  lg:w-[220px]    h-screen    border-r border-border  hidden md:block    p-3  '>
  {navLinks?.map((item, i)  => (
    <Link key={i}  href={item.href}  className={`  ${pathName  === item.href  && "border-r-2  border-blue-500"} flex space-x-3 items-center  mb-5`}>
       <item.icon  className='text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0' />
       <p  className={`  ${pathName  ===  item.href  &&  "text-secondary-foreground  text-lg  text-blue-500 "} text-muted-foreground  text-sm`}>{item.label}</p>
      </Link>
  ))}

  
    </div>
  )
}
