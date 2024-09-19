


"use client"
import { ModeToggle } from '@/components/switch-theme'
import React, {useState, useEffect} from 'react'
import {
    useQuery,
    useMutation,
    useQueryClient,
    QueryClient,r,
  } from '@tanstack/react-query'
  import io from 'socket.io-client';
  import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"

  import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"

  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  import { useQRCode } from 'next-qrcode'
  import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  } from "@/components/ui/drawer"
  import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
  import { Input } from "@/components/ui/input"
  import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { useParams, useRouter } from 'next/navigation'
import { AlertCircle, CheckCheckIcon, ChevronRight, CircleCheckBig, Loader, Loader2, LoaderPinwheel, Mail, MessageCircleWarningIcon, MoveRight, Phone, QrCode, TimerIcon, UserRound, Wallet, X } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { Magic } from 'magic-sdk';
import { HederaExtension } from '@magic-ext/hedera';
import { AccountId, TransferTransaction, Hbar, HbarUnit, HbarAllowance } from '@hashgraph/sdk';
import { MagicWallet,  } from '@/utils/magicWallet';
import { MagicProvider } from '@/utils/magicProvider';
import CountdownTimer from '@/components/CountDown';
import { HEDERA_LOGO_URL, HEDERA_TESTNET, INVOICE_ABB, WEBSITE_BASE_URL } from '@/utils/constants';
import { AnimatePresence, motion } from "framer-motion"
import Image from 'next/image';

import OnChainDtaNav from './OnChainDtaNav';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { WalletSelector } from '@/components/aptos-connector/wallet-selector';
import { WalletSelector2 } from '@/components/aptos-connector/wallet-selector2';
import { aptos } from '@/lib/aptos-config';
import { toHumanReadable, toSmallestUnit } from '@/utils/aptosUtils';
import { truncateText } from '@/lib/truncateTxt';
import Lottie from "lottie-react";
import CheckIcon  from '../../../animations/check-icon.json'
import SuccessState from './success-state';
import PaidState from './paid-status';
import FailedState from './failedState';






const formSchema = z.object({
    payerEmail: z.string(),
    payerName : z.string(),
      payerAddress : z.string(),
       country :   z.string(),
      addressLine1  :  z.string(),
      addressLine2  :  z.string(),
      city :  z.string(),
      state : z.string(),
      zipCode :  z.string()
   })
export default function InvoiceCheckOut() {
    const [txHash, settxHash] = useState("")
    const [userMetadata, setUserMetadata] = useState({});
    const [sendingTransaction, setSendingTransaction] = useState(false);
    const [formattedBalance1, setformattedBalance] = useState()
    const [balances, setbalances] = useState()
    const [isCheckingOut, setisCheckingOut] = useState(false)
    const [testTruth, settestTruth] = useState(true)
    const [isBro, setisBro] = useState(false)
    const [status, setStatus] = useState()
    const {connected, connect, account, signAndSubmitTransaction} = useWallet()
 
    const {toast}  = useToast()
const params =  useParams()
    const  router =  useRouter()
    const invoiceId = params.sessionId
  const  PAY_BASE_URL = `https://got-be.onrender.com/invoice/`
   const  LOCAL_BASE_URL  = "http://localhost:5000/invoice/"
   const  LOCAL_HOME_URL  = "http://localhost:5000"
   const  OFFICIAL__BASE_URL  = "http://localhost:5000"


  const { Canvas } = useQRCode();

    console.log("invoice id", invoiceId)
        // 1. Define your form.
        const form = useForm<z.infer<typeof formSchema>>({
            resolver: zodResolver(formSchema),
            defaultValues: {
            // payerEmail : "",
             payerName :  "",
             payerAddress : "hedera",
             country  :  "",
             addressLine1  : "",
             addressLine2  : "",
             zipCode  : "",
             
            },
          })
        

              // Initialize socket only once using useEffect
  const socket = io(LOCAL_HOME_URL, { autoConnect: false });


  useEffect(() => {
    socket.connect();

    socket.on('connect', () => {
      console.log(`Connected to server with ID: ${socket.id}`);
    });

    socket.on('invoiceStatus', (newStatus) => {
      console.log("The payment status:", newStatus);
       if(newStatus.invoiceId  === invoiceId){
        setisCheckingOut(false)
       }
      
      //alert("changed")
      setStatus(newStatus);
    });

    return () => {
      socket.disconnect();
    };
  }, [])


            

            useEffect(() => {

              //  FETCH  USER  WALLET  INFORMATION

              const fetchUserAPTbalance = async ()  =>  {
                const aptBlance =  await  aptos.getAccountAPTAmount({
                   accountAddress :  account?.address
                 })
    console.log("aptos balances", toHumanReadable(aptBlance, 8) )
                 setbalances(aptBlance)
               }


               const fetchAccountInfo = async ()  =>  {
                const accountInfo =  await  aptos.getAccountInfo({
                   accountAddress :  account?.address
                 })
    console.log("aptos account info", accountInfo)
                 setbalances(aptBlance)
               }
  fetchAccountInfo()
              fetchUserAPTbalance()

                
              }, [account, connected]);




  const RECIEVER  = "0x09d29f0ec5b03fc73b59e35deb80356cde17b13b8db94ded34fc8130dc1da1d9"
                      const handleTransfer2 =  async ()  =>  {
  try{
                        const response = await signAndSubmitTransaction({
                          sender: account.address,
                          data: {
                            function: "0x1::coin::transfer",
                            typeArguments: ["0x1::aptos_coin::AptosCoin"],
                            functionArguments: [RECIEVER, toSmallestUnit("0.01", 8)],
                          },
                        });
                        // if you want to wait for transaction
                
                         console.log("the tx response", response)
                        
                          const res = await aptos.waitForTransaction({ transactionHash: response.hash });
                          setSendingTransaction(true)
                          console.log("await response", res)
                          return  res.hash
                           
                        } catch (error) {
                          toast({
                            variant  : "destructive",
                            title  : "spmething went wrong",
                            description : "something went  wrong please  check you connection and  try aagain"
                          })
                          console.error("something went wrong", error);
                        }

                      }

                    //  HANDLE  SEND RECIEPT

                     const handleSendReciept =  async ()  =>  {
                      const EMAIL_BASE_URL =  "https://got-be.onrender.com/emails/send-reciept"

                      try {
                        const res =  axios.post(EMAIL_BASE_URL, {
                          to  : userMetadata?.email,
                           amount :  data?.session?.amount,
                           receiver_wallet : data?.reciever?.userId?.wallet,
                           payment_link  : data?.session?.paymentLinkId
                        })
                        
                      } catch (error) {

                         console.error("something went wrong when sending reciept", error)
                        
                      }
                     }



                      const  handleInitiatePayment =  async ()  =>  {
                        try {
                            const  res  =  await axios.post(`${LOCAL_BASE_URL}initiate-payment/${invoiceId}`)
                              console.log(res.data)
                        } catch (error) {
                          console.log("something went wrong initiating payment", error)
                        }
                      }


                console.log("on-chain user data", userMetadata)
       
       
        
          // 2. Define a submit handler.
          const pay  =  async ()=>{
            setisCheckingOut(true)
        
            try {
              
              const txHash =  await  handleTransfer2()
              await handleInitiatePayment()
              settxHash(txHash)
              const valueData =  {
                    txHash,
                    senderWallet : account?.address
               }
              const  res  = await  axios.post(`${LOCAL_BASE_URL}check-out/${invoiceId}`,  valueData)
                 toast({
                  title  : "New ;onk created",
                  description :  "Youve  succefully created new payment link"
                 })
                  //await   handleSendReciept()
                  
                   console.log(res.status)
              
            } catch (error) {
               console.log("error", error)
               setisCheckingOut(false)
               toast({
              variant  : "destructive",
                title : "something went wrong",
                description  : "something went wrong check consol"
               })
              
            }
              
        
            
           
          }
  
    const handleFetchSession  =   async ()  =>  {
      const res  =  await  axios.get(`${LOCAL_BASE_URL}get-invoice/${invoiceId}`)
       return res.data
    }

      const {data, isPending, isError, isSuccess, isLoading, error}  = useQuery({
       queryKey : ['sessionData'],
       queryFn : handleFetchSession
      })
  console.log("information", data)



 


    const  SESSION_EXP_TIME =  data?.session?.durationTime

        // Function to format the date
  const formatDate = (dateStr) => {
    const dateObj = new Date(dateStr);
    const formatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });
    return formatter.format(dateObj);
  }
        
  
   /* if(error){
      return(
        <div className='w-full h-screen flex items-center justify-center'>

          <p className='font-semibold text-center'>Something went wrong please check your connection and reload</p>
          <p className='text-muted-foreground text-center'>Or reach out to our customer suport</p>
        </div>
      )
    }*/

   /* if(isLoading){
      return(
        <div className='w-full h-screen flex items-center justify-center'>

         <Loader

className='w-24 h-24 text-indigo-500 animate-spin'
/>
        </div>
      )
    }*/



       


  

            console.log("the  fromatted balance", formattedBalance1)

              const  getPaymentState =  ()  =>  {

                if(data?.invoice.status === "paid"   /*isBro*/){

                  return(
                   <PaidState  data={data}  status={status} />
                  )

                }else
                if( ! status  &&  data?.invoice.status !== "paid"   /*isBro*/   ){
                  return(
                <>
                    <div  className='flex  justify-between items-center  my-6 mb-6'>
                       <h1  className='font-semibold  text-sm lg:text-xl'>  Pay with</h1>
                         
                              
                           
                         
                    </div>
                 
                   
                  
                 <div className='border p-3 rounded-xl'>
                  <div className='flex items-center space-x-2 my-4 mb-6 '>
                     <Wallet className='w-5 h-5'  />
                     <p className=''>Wallet</p>
                  </div>
                   {! connected  ?  (
                    <WalletSelector2  />
                   ) : (
                    <Button  onClick={pay} className={`w-full capitalize `} disabled={isCheckingOut}>{data?.reciever?.labelText ? `${data?.reciever?.labelText} Now` : isCheckingOut ? "Sending.." : "Continue to pay"}</Button>  

                   )}
                   </div>
                  
                    <Accordion type="single" collapsible className="w-full my-4">
                 
                    <AccordionItem value="item-2" className='my-3 border px-2 rounded-xl'>
                      <AccordionTrigger>
                         <div  className='flex items-center space-x-2'><QrCode className='w-5 h-5'  />
                         <p>Scan QR  code</p>
                          </div>
                      </AccordionTrigger>
                      <AccordionContent className='flex  items-center justify-center  '>
                         <div  className='my-4  flex  items-center justify-center  flex-col'>
                             <div  className=' bg-slate-100 rounded-xl p-2'>
                      <Canvas
                       text={`${WEBSITE_BASE_URL}payment/checkout-session/${invoiceId}`}
                       options={{
                         errorCorrectionLevel: 'M',
                         margin: 2,
                         scale: 20,
                         width: 190,
                         color: {
                             dark: '#09090b',
                             light: '#f8fafc',
                           },
                       }}
                       logo={{
                         src: 'https://pbs.twimg.com/profile_images/1556801889282686976/tuHF27-8_400x400.jpg',
                         options: {
                           width: 35,
                           x: undefined,
                           y: undefined,
                           
                         }
                       }}
                     />
                 </div>
                 
                   <div  className='border  p-3 mt-3 rounded-xl'>
                       <div  className='my-4 '>
                          <h1  className='font-medium text-sm   mb-1'>{`Send ${data?.invoice?.paymentToken}  on Aptos network`}</h1>
                           <div className='flex items-center  space-x-1'>
                              <MessageCircleWarningIcon  className='w-3 h-3 text-muted-foreground'  />
                               <p  className='text-xs  text-muted-foreground'>Sending funds on the wrong network or token leads to fund loss.</p>
                           </div>
                       </div>
                       <Button disabled ={isCheckingOut || ! status}  className='w-full '>
                       
                      { status &&  status.status  === "COMPLETED"  && status.invoiceId === invoiceId ?  (
                        <>
                        <CheckCheckIcon className="mr-2 h-4 w-4" />
                         Payment made succfully
                         </>
                         )  : status &&  status.status  === "FAILED"  && status.invoiceId === invoiceId? (
                          <>
                              <AlertCircle className='mr-2 h-4 w-4 text-red-600' />
                              Payment failed
                          </>
                         ) : (
                          <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Checking payment status..
                          </>
                         ) }
                     </Button>
                   </div>
                 </div>
                       
                      </AccordionContent>
                    </AccordionItem>
                   
                  </Accordion>
                   
                       </>
                
                  
                  )
                
                   
                      

                  
                              
                  
                }  else if(status &&  status.status  === "COMPLETED"  && status.invoiceId === invoiceId /*testTruth*/ ){
     return(
      <SuccessState data={data} status={status} />
     )
                }else if(status &&  status.status  === "FAILED"  && status.invoiceId === invoiceId  /*! testTruth*/ ){
                  return(
                    <FailedState  />
                   )

                }else if( status &&  status.status  === "PENDING"   /*! testTruth*/){
                  return(
                    <AnimatePresence>
                    < motion.div  
                    className='flex items-center justify-center  w-full p-5 rounded-xl border  '
                    initial={{ y : 3 }}
                    transition={{ease : "easeIn", duration : 1}}
                    animate={{ y: -3 }}
                    exit={{ opacity: 0 }}
                    key={"pending"}
                    >
                       <div  className='  w-full items-center justify-center  '>
                     
              
                <div className=' pb-6 pt-5 flex flex-col justify-center items-center '>
                <Loader2  className='w-16 h-16 mb-4  animate-spin' />
                    <h1  className='text-xl leading-snug font-semibold text-center'>Processing Your Payment </h1>
                     <h2 className='text-muted-foreground text-sm text-center'></h2>
                </div>
              
                       </div>
              
                    </motion.div>
                    </AnimatePresence>
                  )
                }
              }


             
            
  return (
    <div className=' max-w-5xl mx-auto    my-4 h-screen'>
    {/*} <OnChainDtaNav walletAddress={userMetadata?.publicAddress} balance={formattedBalance1} />*/}

    {connected  &&  (
      <div className='absolute right-2 mb-4'> 
  <WalletSelector2  />

      </div>
    )}
        <div  className='flex flex-col md:flex-row lg:space-x-1 '>
          <div  className='flex-1 w-full md:min-h-screen bg-zinc-50 items-center justify-center relative   p-6  '>
        
               <div  className='my-8'>
                <div className='flex space-x-8'>
                   <p className='text-sm text-muted-foreground'>Invoice</p>
                    <div className='border text-blue-500 text-sm'>{INVOICE_ABB}{data?.invoice?.invoiceNumber}</div>
                </div>
                <div className='flex space-x-2 my-3'>
                   <Image  src={HEDERA_LOGO_URL} width={100} height={100} alt='currency logo' className='w-8 h-8 rounded-full' />
                   <p className='font-medium text-2xl'>{data?.invoice?.subtotal}</p>
                   <p className='font-medium text-2xl'>{data?.invoice?.paymentToken}</p>
                </div>
                <div className='flex items-center space-x-4'>
                   <p>Due date</p>
               <p className='text-xs text text-muted-foreground'>     {data?.invoice?.dueDate}</p>
                    
                </div>
               </div>

                 <div  className='my-5  h-[1.5px]  bg-muted'></div>

                  <div  className=''>
                   <div className='flex items-center justify-between w-full pb-3 mb-3 '>
                     <p className='text-sm text-muted-foreground'>To</p>
                     <p className='text-sm text-muted-foreground'>{data?.invoice?.customer?.customerName}</p>
                   </div>
                   <div className='flex items-center justify-between w-full pb-3 mb-3 border-b'>
                     <p className='text-sm text-muted-foreground'>From</p>
                     <p className='text-sm text-muted-foreground'>{data?.invoice?.customer?.customerName}</p>
                   </div>

                   
  
                  </div>

                

                   <div  className='absolute bottom-14 w-full hidden lg:flex'>
                     powerd by me

                     <button onClick={()  => settestTruth(! testTruth)}>test truth</button>
                     <Button  onClick={handleInitiatePayment}>initiate payments</Button>

                   </div>

         </div>
          <div  className='flex-1   md:h-screen    p-6  '>
            {getPaymentState()}
          </div>
         
          </div>

  

    </div>
  )
}
