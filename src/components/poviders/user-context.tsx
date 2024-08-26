
//@ts-nocheck

import React, { createContext, useState, useContext, useEffect } from 'react';
import {useAccount, useSignMessage}  from 'wagmi'
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import { useToast } from '../ui/use-toast';
import { useRouter } from 'next/navigation';
 type providerProps = {
  isSigningIn ? :any
  logout : any
     verifyOtp : any
     userProfile : any
 } 
// Create a context
const UserContext = createContext<providerProps | undefined>(undefined);

export const useUserContext = (): providerProps => {
    const context = useContext(UserContext)

    if(!context){
        throw new Error ("must be used in providers")
    }
    return context
}

  type ContextProps = {
    children : React.ReactNode
  }
export const UserContextProvider =({children} : ContextProps) => {
    const {toast} = useToast()

   const [userProfile, setuserProfile] = useState(null)

   const [isSigningIn, setisSigningIn] = useState(false)
const router = useRouter()

      


   


      useEffect(() => {
        const token = localStorage.getItem('kbg4_accessToken');
        if (token) {
            const decoded = jwtDecode(token);
            setuserProfile(decoded);
        }
    }, []);




  const  BASE_URL  = "https://got-be.onrender.com/auth/"

 

  const  verifyOtp =   async (userEmail, otpValue)  =>  {
    setisSigningIn(true)

try {
    const res = await axios.post(`${BASE_URL}verify-otp`, {
        "email" : userEmail,
        "enteredOtp" : otpValue
     })

     const token = await res.data;
     console.log("The jwt tokens:", token);
     localStorage.setItem('kbg4_accessToken', token?.token);
     const decoded = jwtDecode(token?.token);
      setisSigningIn(false)
      setuserProfile(decoded);
      router.push("/dashboard")

         
    
} catch (error) {
    toast({
        title : "Something went wrong",
        description : "Please check your connection and try again",
        variant : "destructive"
    })
    setisSigningIn(false)
    
}
     
  }



const logout = () => {
  localStorage.removeItem('kbg4_accessToken');
  setuserProfile(null);
};


   const value = {
    isSigningIn,
    logout,
      userProfile,
       verifyOtp,
   }

   return(
    <UserContext.Provider value={value}>
        {children}
    </UserContext.Provider>
   )

}