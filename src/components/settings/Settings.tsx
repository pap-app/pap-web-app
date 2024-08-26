"use client"

import React, {useState} from 'react'
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { useToast } from '@/components/ui/use-toast'
import axios from 'axios'
import { Separator } from '../ui/separator'
import { useQuery } from '@tanstack/react-query'
import { useUserContext } from '../poviders/user-context'


const formSchema = z.object({
    firstName : z.string(),
    lastName : z.string(),
    wallet : z.string(),
    brandColor  : z.string(),
    businessName : z.string()
   // recieverWallet :  z.string()
  
  })
export default function Settings() {
    const [isUpdating, setisUpdating] = useState(false)
    const {toast}  =  useToast()

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
          // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName : data?.user?.firstName || "",
      lastName : data?.user?.lastName || "",
      businessName : data?.user?.businessName || "",
      wallet : data?.user?.wallet || "",
      brandColor : data?.user?.brandColor || "",
      
     
    },
  })

  const {userProfile}  = useUserContext()




  //const  PAY_BASE_URL = `https://got-be.onrender.com/auth/`
  const LOCAL_AUTH_UPDATE_URL = "http://localhost:5000/auth/"
 
  // 2. Define a submit handler.
  const onSubmit  =  async (values: z.infer<typeof formSchema>)=>{
    setisUpdating(true)

    try {
      const  res  = await  axios.put(`${LOCAL_AUTH_UPDATE_URL}user/${userProfile?.id}/update-profile`,  values)
         toast({
          title  : "Profile updated",
          description :  "Youve  succefully updated your brand profile"
         })
           
        setisUpdating(false)
   
           console.log(res.status)
      
    } catch (error) {
       console.log("error", error)
       setisUpdating(false)
       toast({
        title : "something went wrong",
        description  : "something went wrong, report the issue to our customer support "
       })
      
    }
      

        
    console.log("the value", values)
   
  }
  return (
    <div>
   <div className='my-3'>
     <h1 className='font-semibold text-lg'>Account settings</h1>
     <p>Customize your checkout page</p>
   </div>
   <div>
     <div className=' max-w-xl'> 
     <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="firstName"
            rules={{
              required : true
            }}
          render={({ field }) => (
            
                 <FormItem  className='my-5'>
                    <div className='flex justify-between items-center space-x-4'>
              <FormLabel className=''>First name</FormLabel>
              <FormControl className='w-[70%]'>
                <Input placeholder="kabugu." {...field} />
              </FormControl>
              </div>
              <FormMessage />
            </FormItem>      )}/>


            <FormField
          control={form.control}
          name="lastName"
            rules={{
              required : true
            }}
          render={({ field }) => (
            
                 <FormItem  className='my-5'>
                    <div className='flex justify-between items-center space-x-4'>
              <FormLabel className=''>Last name</FormLabel>
              <FormControl className='w-[70%]'>
                <Input placeholder="kabugu." {...field} />
              </FormControl>
              </div>
              <FormMessage />
            </FormItem>      )}/>

            <FormField
          control={form.control}
          name="wallet"
            rules={{
              required : true
            }}
          render={({ field }) => (
            
                 <FormItem  className='my-5'>
                    <div className='flex justify-between items-center space-x-4'>
              <FormLabel className=''>Wallet address</FormLabel>
              <FormControl className='w-[70%]'>
                <Input placeholder="00.00" {...field} />
              </FormControl>
              </div>
              <FormMessage />
            </FormItem>      )}/>

            <FormField
          control={form.control}
          name="businessName"
            rules={{
              required : true
            }}
          render={({ field }) => (
            
                 <FormItem  className='my-5 p-4'>
                    <div className='flex justify-between items-center space-x-4'>
              <FormLabel className=''>Business name</FormLabel>
              <FormControl className='w-[70%]'>
                <Input placeholder="Hedera" {...field} />
              </FormControl>
              </div>
              <FormMessage />
            </FormItem>      )}/>

            <FormField
          control={form.control}
          name="brandColor"
            rules={{
              required : true
            }}
          render={({ field }) => (
            
                 <FormItem  className='my-5'>
                    <div className='flex justify-between items-center space-x-4'>
              <FormLabel className=''>Brand color</FormLabel>
              <FormControl className='w-[70%]'>
                <Input type='text' placeholder="#236B" {...field} />
              </FormControl>
              </div>
              <FormMessage />
            </FormItem>      )}/>
            <Button type="submit" className='w-full my-4'  disabled={isUpdating}>{isUpdating  ?  "Loading.."  :  "Submit"}</Button>

             </form></Form>

             <Separator className='my-10' />

              <div className='my-5 flex items-center justify-between'>
                 <h2>Email id</h2>
                  <p>{data?.user?.email}</p>
              </div>

             
     </div>
   </div>
    </div>
  )
}
