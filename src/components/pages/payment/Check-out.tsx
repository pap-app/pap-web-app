


"use client"
import { ModeToggle } from '@/components/switch-theme'
import React, {useState, useEffect} from 'react'
import {
    useQuery,
    useMutation,
    useQueryClient,
    QueryClient
  } from '@tanstack/react-query'
  import io from 'socket.io-client';

import { z } from "zod"
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { useParams, useRouter } from 'next/navigation'
import { AlertCircle, CheckCheckIcon, CircleCheckBig, Loader, Loader2, LoaderPinwheel, Mail, MessageCircleWarningIcon, Phone, QrCode, TimerIcon, UserRound, Wallet, X } from 'lucide-react'

import { MagicWallet,  } from '@/utils/magicWallet';
import { MagicProvider } from '@/utils/magicProvider';

import { AnimatePresence, motion } from "framer-motion"
import Image from 'next/image';
import { magic } from '@/lib/create-magic-link-instance';

import { useWallet } from '@aptos-labs/wallet-adapter-react';

import { WalletSelector2 } from '@/components/aptos-connector/wallet-selector2';
import { aptos } from '@/lib/aptos-config';
import { toHumanReadable, toSmallestUnit } from '@/utils/aptosUtils';
import { truncateText } from '@/lib/truncateTxt';
import PayState from './pay-state';
import SessionSuccess from './success-state';
import FailedState from '../invoices/failedState';

// PAY STATE


import CountdownTimer from '@/components/CountDown'

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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  import { useQRCode } from 'next-qrcode'
  import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
  import { Input } from "@/components/ui/input"
  import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useToast } from '@/components/ui/use-toast';
import { HEDERA_LOGO_URL, WEBSITE_BASE_URL } from '@/utils/constants';
import PaidState from '../invoices/paid-status';


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


export default function CheckOut() {
    
    const [status, setStatus] = useState();
 
    const [balances, setbalances] = useState()
    const [isCheckingOut, setisCheckingOut] = useState(false)
    const [testTruth, settestTruth] = useState(true)
    const {connected, connect, account, signAndSubmitTransaction} = useWallet()
 
   
const params =  useParams()
    const  router =  useRouter()
    const sessionId = params.sessionId
  const  PAY_BASE_URL = `https://got-be.onrender.com/pay/`
   const  LOCAL_BASE_URL  = "http://localhost:5000/pay/"
   const  LOCAL_HOME_URL  = "http://localhost:5000"
   const  OFFICIAL__BASE_URL  = "http://localhost:5000"
   const {toast}  = useToast()


 
        

              // Initialize socket only once using useEffect
  const socket = io(LOCAL_HOME_URL, { autoConnect: false });


  useEffect(() => {
    socket.connect();

    socket.on('connect', () => {
      console.log(`Connected to server with ID: ${socket.id}`);
    });

    socket.on('paymentStatus', (newStatus) => {
      console.log("The payment status:", newStatus);
       if(newStatus.sessionId  === sessionId){
        setisCheckingOut(false)
       }
      
      //alert("changed")
      setStatus(newStatus);
    });

    return () => {
      socket.disconnect();
    };
  }, [])

console.log("status", status)
            

            useEffect(() => {

              //  FETCH  USER  WALLET  INFORMATION

              const fetchUserAPTbalance = async ()  =>  {
                const aptBlance =  await  aptos.getAccountAPTAmount({
                   accountAddress :  account?.address
                 })
    
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



 const { Canvas } = useQRCode();

  
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

  const RECIEVER  = "0x09d29f0ec5b03fc73b59e35deb80356cde17b13b8db94ded34fc8130dc1da1d9"
                      const handleTransfer2 =  async ()  =>  {
  try{
                        const response = await signAndSubmitTransaction({
                          sender: account?.address,
                          data: {
                            function: "0x1::coin::transfer",
                            typeArguments: ["0x1::aptos_coin::AptosCoin"],
                            functionArguments: [RECIEVER, toSmallestUnit("0.01", 8)],
                          },
                        });
                        // if you want to wait for transaction
                
                         console.log("the tx response", response)
                        
                          const res = await aptos.waitForTransaction({ transactionHash: response.hash });
                        
                          console.log("await response", res)
                          return  res.hash
                           
                        } catch (error) {
                        
                          console.error("something went wrong", error);
                        }

                      }

                   // 2. Define a submit handler.
          const onSubmit  =  async (values: z.infer<typeof formSchema>)=>{
            setisCheckingOut(true)
           
        
            try {
              
              const txHash =  await  handleTransfer2()
              await handleInitiatePayment()
          
              const valueData =  {
                   payerEmail : values.payerEmail,
                   payerName : values.payerName,
                   payerWallet : account?.address,
                   payerAddress : {
                    country : values.country,
                    addressLine1 : values.addressLine1,
                    addressLine2 : values.addressLine2,
                     city : values.city,
                     state : values.state,
                     zipCode : values.zipCode
  
                   },
                   transactionHash : txHash
                
              }
              const  res  = await  axios.post(`${LOCAL_BASE_URL}check-out/${sessionId}`,  valueData)
                /* toast({
                  title  : "New ;onk created",
                  description :  "Youve  succefully created new payment link"
                 })*/
                  //await   handleSendReciept()
                  
                   console.log(res.status)
              
            } catch (error) {
               console.log("error", error)
               setisCheckingOut(false)
               /*toast({
                title : "something went wrong",
                description  : "something went wrong check consol"
               })*/
              
            }
              }

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
                            const  res  =  await axios.post(`${LOCAL_BASE_URL}initiate-payment/${sessionId}`)
                              console.log(res.data)
                        } catch (error) {
                          console.log("something went wrong initiating payment", error)
                        }
                      }


         
       
       
        
                      const handleFetchCountries  =   async ()  =>  {
                        const res  =  await  axios.get(`https://restcountries.com/v3.1/all?fields=name,flags`)
                         return res.data
                      }
                
                      const {data : countries, isError : isCountriesError, isSuccess : isCountriesSuccess, isLoading : isCountriesLOading, error : countriesErro}  = useQuery({
                        queryKey : ['countries'],
                        queryFn : handleFetchCountries
                       })
                
  
    const handleFetchSession  =   async ()  =>  {
      const res  =  await  axios.get(`${PAY_BASE_URL}session/${sessionId}`)
       return res.data
    }

    
    
  
      const {data, isPending, isError, isSuccess, isLoading, error}  = useQuery({
       queryKey : ['sessionData'],
       queryFn : handleFetchSession
      })
  console.log("information", data)



 


    const  SESSION_EXP_TIME =  data?.session?.durationTime
        
  
    if(error){
      return(
        <div className='w-full h-screen flex items-center justify-center'>

          <p className='font-semibold text-center'>Something went wrong please check your connection and reload</p>
          <p className='text-muted-foreground text-center'>Or reach out to our customer suport</p>
        </div>
      )
    }

    if(isLoading){
      return(
        <div className='w-full h-screen flex items-center justify-center'>

         <Loader

className='w-24 h-24 text-indigo-500 animate-spin'
/>
        </div>
      )
    }



       


  


              const  getPaymentState =  ()  =>  {
                if(data?.session?.paymentStatus   === "completed"){
   return(
    <PaidState data={data} status={status}  />
   )
                }
                if(!status    && data?.session?.paymentStatus  !== "completed" /* !testTruth  */  ){
                  return(
                 <PayState     data={data} status={status} SESSION_EXP_TIME={SESSION_EXP_TIME}  isCheckingOut={isCheckingOut} setisCheckingOut={setisCheckingOut}  />
              
                  )
                   
                }  else if(status &&  status.status  === "COMPLETED"  && status.sessionId === sessionId /*testTruth */){
     return(
     <SessionSuccess   data={data} status={status}    />
     )
                }else if(status &&  status.status  === "FAILED"  && status.sessionId === sessionId ){
                  return(
                   <FailedState  />
                   )

                }else if( status &&  status.status  === "PENDING"  && status.sessionId === sessionId  /*! testTruth */){
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
                <Loader2  className='w-16 h-16 mb-3 animate-spin' />
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
    <div className=' max-w-5xl mx-auto    my-4 h-screen  '>
    {/*} <OnChainDtaNav walletAddress={userMetadata?.publicAddress} balance={formattedBalance1} />*/}

    {connected  &&  (
      <div className='absolute  right-2 '> 
  <WalletSelector2  />

      </div>
    )}
        <div  className='flex flex-col md:flex-row lg:space-x-1 '>
          <div  className='flex-1 w-full md:min-h-screen bg-zinc-50 items-center justify-center relative   p-6  '>
        
               <div  className='my-5'>
                 <h1  className='text-lg  font-medium my-2'>{data?.reciever?.linkName}</h1>
                  <h2  className='text-muted-foreground text-xs'>{data?.reciever?.description}</h2>
               </div>

                 <div  className='my-5  h-[1.5px]  bg-muted'></div>

                  <div  className='flex  space-x-2  items-center'>
                    <Image src={HEDERA_LOGO_URL} height={100} width={100} alt='token logo' 
                      className='w-4 h-4 rounded-full'
                    />
                     <p>{data?.session?.amount} APT</p>
                  </div>


  {/*REMOVED PRODUC IMAGE  
                  <div className='my-5  flex items-center justify-center lg:justify-start lg:items-start'>
                     <Image     src={`/img/messi.png`}  width={300} height={300} alt='product image' className='border w-56 h-52 md:w-72 md:h-80 object-cover'  />
                  </div>
*/}
                   <div  className='absolute bottom-14 w-full hidden lg:flex'>
                     powerd by me

                     <button onClick={()  => settestTruth(! testTruth)}>test truth</button>
                     <Button  onClick={handleInitiatePayment}>initiate payments</Button>

                   </div>

         </div>
          <div  className='flex-1   md:h-screen    p-6  '>
          {getPaymentState()}
          </div>
          



            
          
                         
                 
            </div>    </div>           
       
         
            )}

  

  
