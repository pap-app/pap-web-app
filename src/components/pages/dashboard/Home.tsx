"use client"

import { Button } from '@/components/ui/button'
import { Link as LinkIcon , Plus } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { TopCrads } from './TopCards'
import LatestPayments from './LatestPayments'
import { IconInvoice } from '@tabler/icons-react'
import LinkPageNav from '@/components/LinkPageNav'


 
export default function Home() {
  return (
    <div  className='w-full'>
       <LinkPageNav  title='Today'  />


           <div>
             <TopCrads   />
           </div>

            <LatestPayments  />
    </div>
  )
}
