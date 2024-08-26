import LinkPageNav from '@/components/LinkPageNav'
import LatestPayments from '@/components/pages/dashboard/LatestPayments'
import Navbar from '@/components/pages/dashboard/Navbar'
import SideBar2 from '@/components/pages/dashboard/Sidebar2'
import React from 'react'

export default function page() {
  return (
    <div  className='w-full'>

        <Navbar  />

        <div  className=' w-full max-w-[1600px]   min-h-screen  flex space-x-3    mx-auto'>
     <SideBar2  />
     <div  className='w-full'>
    
  
        
  <LatestPayments  />

            
     </div>
   
     </div>

      
         
    </div>
  )
}
