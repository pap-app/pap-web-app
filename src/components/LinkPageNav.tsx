import React from 'react'
import { Button } from '@/components/ui/button'
import { Link as LinkIcon , Plus } from 'lucide-react'
import Link from 'next/link'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  import { IconInvoice } from '@tabler/icons-react'



type Props =  {
  title :  string
}
export default function LinkPageNav({title}: Props) {
  return (
    <div  className=' justify-between   items-center  my-5  hidden md:flex'>
    <h2  className='text-xl  font-semibold'>{title}</h2>
   

     <DropdownMenu>
<DropdownMenuTrigger asChild>
<Button  variant={"secondary"}   className='bg-indigo-500  text-white flex items-center space-x-2'>
       <Plus  className='w-4 h-4' />
<p>Create payment</p>
          </Button>

</DropdownMenuTrigger>
<DropdownMenuContent align="end" >
<DropdownMenuItem >
 <Link href={`/payment/payment-link/create`} className='p-2 hover:bg-muted flex space-x-2 max-w-56'>
      <LinkIcon className='w-6 h-6' />

       <div>
          <h1  className='font-semibold '>Payment link</h1>
           <p  className='text-muted-foreground text-sm'>Accapte pne-time or recurring payment from anyone</p>
       </div>

 </Link>
</DropdownMenuItem>
<DropdownMenuItem >
<Link href={`/invoices/create`} className='p-2 hover:bg-muted flex space-x-2 max-w-56'>
      <IconInvoice className='w-6 h-6' />

       <div>
          <h1  className='font-semibold '>Invoice</h1>
           <p  className='text-muted-foreground text-sm'>Collect one time payment from specific customer</p>
       </div>

 </Link>
</DropdownMenuItem>
</DropdownMenuContent>
</DropdownMenu>
 </div>
  )
}
