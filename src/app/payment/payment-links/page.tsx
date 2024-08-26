

import Navbar from '@/components/pages/dashboard/Navbar'
import SideBar2 from '@/components/pages/dashboard/Sidebar2'
import React from 'react'
import { Button } from '@/components/ui/button'
import { Link as LinkIcon , Plus } from 'lucide-react'
import Link from 'next/link'
import { IconInvoice } from '@tabler/icons-react'
import LatestPayments from '@/components/pages/dashboard/LatestPayments'
import LinkPageNav from '@/components/LinkPageNav'
import PaymentLinks from '@/components/pages/dashboard/PaymentLinks'
export default function page() {
  return (
    <div  className='w-full'>

        <Navbar  />

        <div  className=' w-full max-w-[1600px]   min-h-screen  flex space-x-3    mx-auto'>
     <SideBar2  />
     <div  className='w-full'>
    <div className='my-5'>
    <LinkPageNav   title='Payment links' />
    </div>
        
<PaymentLinks  />

            
     </div>
   
     </div>

      
         
    </div>
  )
}
