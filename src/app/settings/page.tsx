import LinkPageNav from '@/components/LinkPageNav'
import Navbar from '@/components/pages/dashboard/Navbar'
import PaymentLinks from '@/components/pages/dashboard/PaymentLinks'
import SideBar2 from '@/components/pages/dashboard/Sidebar2'
import Settings from '@/components/settings/Settings'
import React from 'react'

export default function page() {
  return (
    <div  className='w-full'>

        <Navbar  />

        <div  className=' w-full max-w-[1600px]   min-h-screen  flex space-x-3    mx-auto'>
     <SideBar2  />
     <div  className='w-full'>
   
        
<Settings  />

            
     </div>
   
     </div>

      
         
    </div>
  )
}
