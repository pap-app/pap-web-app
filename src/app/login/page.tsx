

import LoginPage from '@/components/pages/login/LoginPage'
import React from 'react'
import withAuth from '../../components/middleware/auth-middleware'
const  page = () => {
  return (
    <div  className='flex items-center justify-center w-full h-screen'>
   <LoginPage  />
    </div>
  )
}

export default page
