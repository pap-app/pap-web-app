
"use client"
import React from 'react'
import { AppSidebar } from './Sidebar'
import { ModeToggle } from '@/components/switch-theme'
import Navbar from './Navbar'
import SideBar2 from './Sidebar2'
import Home from './Home'
import { useUserContext } from '@/components/poviders/user-context'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import withAuth from '@/components/middleware/auth-middleware'

const Dashboard = ()  =>  {
  const {userProfile}  = useUserContext()


    const AUTH_BASE_URL = "https://got-be.onrender.com/auth/"

     const fetchUserProfile =  async ()  =>   {
       const res = axios.get(`${AUTH_BASE_URL}user/${userProfile?.id}`)
       return (await res).data
     }

      const {data}  = useQuery({
        queryKey : ['profile'],
        queryFn : fetchUserProfile
      })
   console.log("the user", data)
  return (
    <div  className='w-full  '>
        <Navbar  email={data?.user?.email} />
           
      <div  className=' w-full max-w-[1600px]   min-h-screen  flex space-x-3    mx-auto'>
     <SideBar2  />
      <Home  />

      </div>
     
   
    </div>
  )
}

export default  withAuth(Dashboard)
