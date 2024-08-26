"use client"


import { ModeToggle } from '@/components/switch-theme'
import React from 'react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"

  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  import Link from 'next/link'
import { navLinks } from '@/utils/constants'
import { MenuIcon, UserCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { truncateText } from '@/lib/truncateTxt'
import Image from 'next/image'
  
type Props = {
  email ?: any
}

export default function Navbar({email} : Props) {
  return (
    <div  className='  w-full sticky top-0 bg-background border-b border-border h-[60px] mb-2  flex items-center justify-center z-40 '>
        <div  className='w-full max-w-[1500px]  m-auto  flex justify-between  items-center'>
          <div  className='flex items-center space-x-2'>
        <div  className=' md:hidden'>
        <Sheet>
  <SheetTrigger>
    <Button    variant={"outline"}  size={"icon"}>.
       <MenuIcon className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0'   />
    </Button>
  </SheetTrigger>
  <SheetContent  side={"left"}>
  {navLinks?.map((item, i)  => (
    <Link key={i}  href={item.href}  className='flex space-x-3 items-center  mb-5'>
       <item.icon  className='text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0' />
       <p  className='text-muted-foreground  text-sm'>{item.label}</p>
      </Link>
  ))}
     
   
  </SheetContent>
</Sheet>

        </div>

        <Link href={`/`} className='flex items-center space-x-1'>
        <Image src={`/img/logo.png`} width={60} height={60} alt='logo' className='w-9 h-9 rounded-full'  />
        <p className='font-bold'>MunaPay</p>

        </Link>
        </div>
        <div  className='flex items-center  space-x-3'>
        <ModeToggle  />

         <div>

         <DropdownMenu>
      <DropdownMenuTrigger asChild>
      <Button variant={"outline"}  size={"icon"} >
<UserCircle  className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-10 dark:scale-100' />
</Button>
        
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
           
              <p>{email && truncateText(email, 20, 4, 9)}</p>
           
        </DropdownMenuItem>
        <DropdownMenuItem >
          <Link  href={'/settings'} >
          <p>Settings</p>
          </Link>
        
        </DropdownMenuItem>
        <DropdownMenuItem >
            log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
       
         </div>
         
        </div>
        </div>
    </div>
  )
}
