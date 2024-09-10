//@ts-nocheck


import axios from 'axios'
import { BadgeInfo, DollarSign, Link, TimerIcon } from 'lucide-react'
import React from 'react'
import { Separator } from '../ui/separator'
import Image from 'next/image'
import { HEDERA_LOGO_URL } from '@/utils/constants'
import { truncateText } from '@/lib/truncateTxt'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"

 type Props = {
    payment  :  any
    time : any
 }
export default function InvoiceDetails({payment,time} :Props) {
  return (
    <div  className='my-3'>
         <div className='text-muted-foreground my-5'>
         <div  className='  flex items-center justify-between my-4'>
                <div className='flex items-center space-x-2 font-medium '>
                 <DollarSign className='w-4 h-4'   />
                 <p className='text-sm'>Amount</p>
                 </div>
                  <div className='flex items-center space-x-2'>
                    <Image src={HEDERA_LOGO_URL} width={100} height={100} alt='currency logo' className='w-4 h-4 rounded-full'  />
                    <p className='text-xs'>{payment?.totalAmount} HBAR</p>
                  </div>
                  
             </div>
             <div  className='  flex items-center justify-between my-4'>
                <div className='flex items-center space-x-2 font-medium '>
                 <BadgeInfo className='w-4 h-4'   />
                 <p className='text-sm'>Status</p>
                 </div>
                  <div>
                    <p className='text-xs'>{payment?.status}</p>
                  </div>
                  
             </div>

             <div  className='  flex items-center justify-between my-4'>
                <div className='flex items-center space-x-2 font-medium '>
                 <TimerIcon className='w-4 h-4'   />
                 <p className='text-sm'>Timestamp</p>
                 </div>
                  <div>
                    <p className='text-xs'>{time}</p>
                  </div>
                  
             </div>

             <div  className='  flex items-center justify-between my-4'>
                <div className='flex items-center space-x-2 font-medium  '>
                 <Link className='w-3.5 h-3.5'   />
                 <p className='text-sm'>Invoice type</p>
                 </div>
                  <div>
                    <p className='text-xs'>one time</p>
                  </div>
                  
             </div>
         </div>

         <Separator   />

         <Dialog>
  <DialogTrigger>Send reminder</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you absolutely sure?</DialogTitle>
      <DialogDescription>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>

  {/*  hide  checkout information  until we  implement the checkout logic*/}

           {/*

         <div className='text-muted-foreground my-6'>
            

           <h1 className='font-semibold text-card-foreground'>Transaction details</h1>
         <div  className='  flex items-center justify-between my-4'>
                <div className='flex items-center space-x-2 font-medium '>
               
                 <p className='text-sm'>Transaction Id</p>
                 </div>
                  <div className='flex items-center space-x-2'>
                    <p className='text-xs'>{truncateText(payment?.sessionId, 20)}</p>
                  </div>
                  
             </div>
             <div  className='  flex items-center justify-between my-4'>
                <div className='flex items-center space-x-2 font-medium '>
                 
                 <p className='text-sm'>Network</p>
                 </div>
                  <div>
                    <p className='text-xs'>Hedera</p>
                  </div>
                  
             </div>

             <div  className='  flex items-center justify-between my-4'>
                <div className='flex items-center space-x-2 font-medium '>
                
                 <p className='text-sm'>Transaction Hash</p>
                 </div>
                  <div>
                    <p className='text-xs'>{truncateText(payment.txHash, 20)}</p>
                  </div>
                  
             </div>

             <div  className='  flex items-center justify-between my-4'>
                <div className='flex items-center space-x-2 font-medium  '>
                 <p className='text-sm'>Fee </p>
                 </div>
                  <div>
                    <p className='text-xs'>0</p>
                  </div>
                  
             </div>
         </div>
         <Separator   />
         <div className='text-muted-foreground my-6'>

<h1 className='font-semibold text-card-foreground'>Checkout session details</h1>
<div  className='  flex items-center justify-between my-4'>
     <div className='flex items-center space-x-2 font-medium '>
    
      <p className='text-sm'>Type</p>
      </div>
       <div className='flex items-center space-x-2'>
         <p className='text-xs'>one time</p>
       </div>
       
  </div>
  <div  className='  flex items-center justify-between my-4'>
     <div className='flex items-center space-x-2 font-medium '>
      
      <p className='text-sm'>Title</p>
      </div>
       <div>
         <p className='text-xs'>{truncateText(payment.paymentLinkId.linkName, 20)}</p>
       </div>
       
  </div>

  <div  className='  flex items-center justify-between my-4'>
     <div className='flex items-center space-x-2 font-medium '>
     
      <p className='text-sm'>Description</p>
      </div>
       <div>
         <p className='text-xs'>{truncateText(payment.paymentLinkId.description, 20)}</p>
       </div>
       
  </div>

  <div  className='  flex items-center justify-between my-4'>
     <div className='flex items-center space-x-2 font-medium  '>
      <p className='text-sm'>Collect email</p>
      </div>
       <div>
         <p className='text-xs'>{payment.paymentLinkId.collectEmail  ?  "Yes" : "No"}</p>
       </div>
       
  </div>
  <div  className='  flex items-center justify-between my-4'>
     <div className='flex items-center space-x-2 font-medium  '>
      <p className='text-sm'>Collect name</p>
      </div>
       <div>
         <p className='text-xs'>{payment.paymentLinkId.collectName  ?  "Yes" : "No"}</p>
       </div>
       
  </div>
  <div  className='  flex items-center justify-between my-4'>
     <div className='flex items-center space-x-2 font-medium  '>
      <p className='text-sm'>Collect address</p>
      </div>
       <div>
         <p className='text-xs'>{payment.paymentLinkId.collectAddress  ?  "Yes" : "No"}</p>
       </div>
       
  </div>
</div>*/}


    
    </div>
  )
}
