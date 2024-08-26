//@ts-nocheck

"use client"

import { ModeToggle } from '@/components/switch-theme'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Mail } from 'lucide-react'
import React, {useState, useEffect} from 'react'
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
  } from "@/components/ui/input-otp"
import axios from 'axios'
import { useToast } from '@/components/ui/use-toast'
import { useUserContext } from '@/components/poviders/user-context'
import { useRouter } from 'next/navigation'
export default function  LoginPage()  {
    const [userEmail, setuserEmail] = useState("")
    const [isRequesting, setisRequesting] = useState(false)
    const [otp, setotp] = useState()
    const [otpValue, setotpValue] = useState()
    const {toast}  = useToast()
const {verifyOtp, isSigningIn, userProfile}  = useUserContext()
const router = useRouter()

useEffect(() => {
  
    if (userProfile) {
      router.push('/dashboard')
    }
}, [userProfile])


 console.log("user profile", userProfile)
    
   const  BASE_URL  = "https://got-be.onrender.com/auth/"
      const  handleReQuestOtp =   async ()  =>  {
        setisRequesting(true)

    try {
        const res = await axios.post(`${BASE_URL}request-otp`, {
            "email" : userEmail
         })

          let OTP_TOKEN  =  res.data?.otp
          setotp(OTP_TOKEN)
          setisRequesting(false)
        
    } catch (error) {
        toast({
            title : "Something went wrong",
            description : "Please check your connection and try again",
            variant : "destructive"
        })
        setisRequesting(false)
        
    }
         
      }

   

      const  getAuthState =  ()  =>  {
        if(otp){
            return(
                <div className='w-full flex items-center justify-center flex-col'>
                    <div className='border rounded-full p-2 flex items-center justify-center bg-muted my-3 animate-bounce'>
        <Mail  />
       </div>
              <h1 className='text-xl font-semibold text-center my-2'>Email authentication</h1>
              <h2 className='text-sm text-muted-foreground text-center'>
              To continue, please enter the 6-digit verification code sent to your Email: {userEmail} fulafunal@gmailcom
              </h2>

               <div className='my-4 w-full flex flex-col items-center justify-center'>
               <InputOTP
        maxLength={6}
        value={otpValue}
        onChange={(value) => setotpValue(value)}
        className='w-full'
      >
        <InputOTPGroup className=''>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>


  <div className='flex  items-center justify-center'>
     <p className='text-xs text-muted-foreground'>Didnt receive a code?</p>
     <Button variant={"link"} className='text-blue-500 text-sm' onClick={() => handleReQuestOtp()}>Resend</Button>
  </div>
               </div >
               <Button className='w-full'  disabled={otpValue?.length < 6} onClick={() => verifyOtp(userEmail, otpValue)} >
                {isSigningIn ?  (
                    <>
                    <Loader2 className='w-4 h-4 mr-2 animate-spin'  />
                     Submitting OTP..
                    </>
                )  : (
                    <>
                     <Mail  className='w-4 h-4 mr-2' />
                     Continue 
                    </>
                )}
               
             </Button>
                   
                </div>
            )
        }else if(! otp){
            return(
<>
<div className='border rounded-full p-2 flex items-center justify-center bg-muted my-4 animate-bounce'>
        <Mail  />
       </div>

 <h1 className='text-xl font-semibold text-center my-4'>Sign in with your Email</h1>
        <div className='w-full'>
            <Input   placeholder="example.gmail.com"
              value={userEmail}
              onChange={(e) => setuserEmail(e.target.value)}
              className='my-4'
            />

             <Button className='w-full'  disabled={isSigningIn}  onClick={()  => handleReQuestOtp()} >
                {isRequesting ?  (
                    <>
                    <Loader2 className='w-4 h-4 mr-2 animate-spin'  />
                     Requesting OTP..
                    </>
                )  : (
                    <>
                     <Mail  className='w-4 h-4 mr-2' />
                     Continue with email
                    </>
                )}
               
             </Button>
        </div></>
            )
        }

      }
  return (
    <div  className='w-[400px] h-[330px] p-4 rounded-xl bg-popover border flex flex-col items-center justify-center'>
   {getAuthState()}
    </div>
  )
}





