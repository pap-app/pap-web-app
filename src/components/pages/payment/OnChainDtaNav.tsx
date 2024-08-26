import { ModeToggle } from '@/components/switch-theme'
import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { ArrowLeftRight, ArrowUp, Copy, DollarSign, UserCircle, Wallet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { HEDERA_LOGO_URL } from '@/utils/constants'
import { useQRCode } from 'next-qrcode'


type Props  =  {
    walletAddress  : any
    balance : any

}
export default function OnChainDtaNav({walletAddress, balance} : Props) {
    const { Canvas } = useQRCode();
  return (
    <div className='w-full flex items-center justify-between px-3 h-[60px] sticky top-0 border-b mb-3 bg-background '>
        <ModeToggle  />

        <div className=''>

        <DropdownMenu>
      
        <DropdownMenuTrigger asChild>
        <Button variant={"outline"}  size={"icon"} >
<UserCircle  className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-10 dark:scale-100' />
</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
     
        <DropdownMenuItem>
           
              <div className='flex items-center justify-between w-full my-2'>
                 <div className='flex items-center space-x-2'>
                     <Wallet className='w-4 h-4'  />
                     <p className='font-semibold text-muted-foreground'>Wallet</p>
                 </div>
                 <p className='text-sm text-muted-foreground'>{walletAddress}</p>
              </div>
           
        </DropdownMenuItem>

        <DropdownMenuItem>
           
           <div className='flex items-center justify-between w-full my-2'>
              <div className='flex items-center space-x-2'>
                  <DollarSign className='w-4 h-4'  />
                  <p className='font-semibold text-muted-foreground'>Balance</p>
              </div>
              <div className='flex items-center space-x-2'>
                <Image src={HEDERA_LOGO_URL}  width={60} height={60} alt='currency logo' className='w-4 h-4 rounded-full'  />
              <p className='text-sm text-muted-foreground'>{balance} HBAR</p>
              </div>
           </div>
           </DropdownMenuItem>
        
  

     <div className='mt-8' >
           
      <div className='flex items-center justify-between w-full my-2 space-x-3 '>
         
             <Dialog>
  <DialogTrigger>
  <Button className='w-full rounded-xl'>
                <ArrowUp  className='w-4 h-4 mr-2'  />
                Deposit
             </Button>
  </DialogTrigger>
  <DialogContent className='w-[300px]'>
    <DialogHeader>
      <DialogTitle>Deposit to your wallet</DialogTitle>
      <DialogDescription>
       <div className='mt-3 flex items-center justify-center flex-col'>
         <h1 className='font-semibold text-lg text-center'>Scan QR code</h1>
         <Canvas
                       text={`${walletAddress}}`}
                       options={{
                         errorCorrectionLevel: 'M',
                         margin: 2,
                         scale: 20,
                         width: 240,
                         color: {
                             dark: '#2563eb',
                             light: '#f8fafc',
                           },
                       }}
                       logo={{
                         src: 'https://pbs.twimg.com/profile_images/1657693585234337792/0Y5Y6bnW_400x400.jpg',
                         options: {
                           width: 35,
                           x: undefined,
                           y: undefined,
                           
                         }
                       }}
                     />

                     <div className='my-3 flex items-center space-x-3'>
                        <p className='font-medium'>{walletAddress}</p>
                         <Copy className='w-5 h-5 cursor-pointer' />
                     </div>
       </div>
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
          
              
             <Dialog>
  <DialogTrigger>
  <Button className='w-full rounded-xl'>
                <ArrowLeftRight   className='w-4 h-4 mr-2'  />
                Transfer
             </Button>
  </DialogTrigger>
  <DialogContent className='w-[300px]'>
    <DialogHeader>
      <DialogTitle>Transfer crypto</DialogTitle>
      <DialogDescription>
       <div className='mt-3 flex items-center justify-center flex-col'>
         <h1 className='font-semibold text-lg text-center'>Send tokens</h1>
           <div>
             <p>Our team is working on this  feature</p>
           </div>
       </div>
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
           </div>
           
      
        </div>
        </DropdownMenuContent>
        </DropdownMenu>
        
        </div>
        
      
    </div>
  )
}
