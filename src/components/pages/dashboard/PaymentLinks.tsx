
//@ts-nocheck


"use client"
import React, {useState} from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter
} from "@/components/ui/table"
import { HEDERA_LOGO_URL, invoicesTest, WEBSITE_BASE_URL } from '@/utils/constants'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { useUserContext } from '@/components/poviders/user-context'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Copy, Ellipsis } from 'lucide-react'
import Paymentdetails from '@/components/sheet/payment-details'
import { truncateText } from '@/lib/truncateTxt'
import Linkdetails from '@/components/sheet/link-details'



export default function PaymentLinks() {
  const [selectedValue, setselectedValue] = useState("")
  const {userProfile}  = useUserContext()

  const PAYMENT_BASE_URL = "https://got-be.onrender.com/auth/"


    const copyLink = (link)  => {
      navigator.clipboard.writeText(link)
    }
   const getUserPayments =  async ()  =>  {
  const  res =  axios.get(`${PAYMENT_BASE_URL}user/${userProfile?.id}/payment-links`)
  return (await res).data
   }

    const {data, isError, isLoading, error}  = useQuery({
      queryKey : ['payments'],
      queryFn : getUserPayments
    })

     console.log("user payments", data)
     console.log("user payments error", error)


         // Assuming the date is in the format "2024-08-17T05:46:24.374Z" and stored in data.date
 
     // Function to format the date
  const formatDate = (dateStr) => {
    const dateObj = new Date(dateStr);
    const formatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });
    return formatter.format(dateObj);
  }


  return (
    <div  className='w-full px-1'>
  



      <div>
      <Table>
      
      <TableHeader>
        <TableRow>
          <TableHead className="w-[170px] ">Created on</TableHead>
          <TableHead>Url</TableHead>
          <TableHead>Title</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead className="w-[100px] text-right">More</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.paymentLinks?.map((item, i) => (
          <TableRow key={i}    className=''>
           
            <TableCell className="font-medium text-muted-foreground">{ formatDate( item.createdAt)  }</TableCell>
           
            <TableCell className='text-sm text-muted-foreground'>
              <div className='flex items-center space-x-3'>
              <p> {  truncateText( `${WEBSITE_BASE_URL}payment/payment-link/${item._id}`, 20,36, 10)} </p>
              <Copy   className='text-muted-foreground w-4 h-4 cursor-pointer' onClick={() => copyLink(`${WEBSITE_BASE_URL}payment/payment-link/${item._id}`)} />
               </div>
               </TableCell>
            <TableCell>
              <p className='font-medium text-muted-foreground'>
              {item.linkName}
                </p></TableCell>
            <TableCell className="text-right flex items-end justify-end"> <div className='flex text-right space-x-2 items-center font-medium text-muted-foreground'>
              <Image  src={HEDERA_LOGO_URL} width={70} height={70} alt='hedera logo' className='rounded-full w-4 h-4' />
              <p>{item.amount ?  `${item.amount} HBAR`  :  "Any amount"} </p>
              </div></TableCell>
            <TableCell className="text-right">
            <Sheet>
  <SheetTrigger>
    <Button variant={"outline"} size={"icon"} >
       <Ellipsis   />
    </Button>
  </SheetTrigger>
  <SheetContent  className="w-[900px] sm:w-[540px]">
    <SheetHeader  className=' border-b'>
      <SheetTitle>Payments</SheetTitle>
   </SheetHeader>
   <Linkdetails payment={item} time={ formatDate( item.createdAt) }   />
  </SheetContent>
</Sheet>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
   
    </Table>
        
        
        </div>   



    </div>
  )
}
