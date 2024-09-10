
//@ts-nocheck

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
import { z } from "zod"
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { useParams, useRouter } from 'next/navigation'
import { AlertCircle, CheckCheckIcon, CircleCheckBig, Loader, Loader2, LoaderPinwheel, Mail, MessageCircleWarningIcon, Phone, QrCode, TimerIcon, UserRound, Wallet, X } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { Magic } from 'magic-sdk';
import { HederaExtension } from '@magic-ext/hedera';
import { AccountId, TransferTransaction, Hbar, HbarUnit, HbarAllowance } from '@hashgraph/sdk';
import { MagicWallet,  } from '@/utils/magicWallet';
import { MagicProvider } from '@/utils/magicProvider';
import CountdownTimer from '@/components/CountDown';
import { HEDERA_TESTNET, WEBSITE_BASE_URL } from '@/utils/constants';
import { AnimatePresence, motion } from "framer-motion"
import Image from 'next/image';
import { magic } from '@/lib/create-magic-link-instance';
import OnChainDtaNav from './OnChainDtaNav';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { WalletSelector } from '@/components/aptos-connector/wallet-selector';
import { WalletSelector2 } from '@/components/aptos-connector/wallet-selector2';
import { aptos } from '@/lib/aptos-config';
import { toHumanReadable, toSmallestUnit } from '@/utils/aptosUtils';
import { truncateText } from '@/lib/truncateTxt';



/*const magic = new Magic('pk_live_C8037E2E6520BBDF', {
  extensions: [
    new HederaExtension({
      network: 'testnet',
    }),
  ],
});*/


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
    const [isUser, setisUser] = useState(false)
    const [isUserLoading, setisUserLoading] = useState(true)
    const [userMetadata, setUserMetadata] = useState({});
    const [sendingTransaction, setSendingTransaction] = useState(false);
    const [email, setemail] = useState("")
    const [publicAddress, setPublicAddress] = useState('');
    const [destinationAddress, setDestinationAddress] = useState('');
    const [status, setStatus] = useState();
    const [sendAmount, setSendAmount] = useState(0);
    const [formattedBalance1, setformattedBalance] = useState()
    const [balances, setbalances] = useState()
    const [isCheckingOut, setisCheckingOut] = useState(false)
    const [testTruth, settestTruth] = useState(true)
    const {connected, connect, account, signAndSubmitTransaction} = useWallet()
 
    const {toast}  = useToast()
const params =  useParams()
    const  router =  useRouter()
    const sessionId = params.sessionId
  const  PAY_BASE_URL = `https://got-be.onrender.com/invoice/`
   const  LOCAL_BASE_URL  = "http://localhost:5000/invoice/"
   const  LOCAL_HOME_URL  = "http://localhost:5000"
   const  OFFICIAL__BASE_URL  = "http://localhost:5000"


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
        

              // Initialize socket only once using useEffect
  const socket = io(LOCAL_HOME_URL, { autoConnect: false });


  useEffect(() => {
    socket.connect();

    socket.on('connect', () => {
      console.log(`Connected to server with ID: ${socket.id}`);
    });

    socket.on('invoiceStatus', (newStatus) => {
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

                      

                  

                      const  handlePay = async ()  =>  {
                         const  txHash  = await  handleTransfer2()
                      }


                      const  handleInitiatePayment =  async ()  =>  {
                        try {
                            const  res  =  await axios.post(`${LOCAL_BASE_URL}initiate-payment/${sessionId}`)
                              console.log(res.data)
                        } catch (error) {
                          console.log("something went wrong initiating payment", error)
                        }
                      }


                console.log("on-chain user data", userMetadata)
       
       
        
          // 2. Define a submit handler.
          const onSubmit  =  async (values: z.infer<typeof formSchema>)=>{
            setisCheckingOut(true)
            /* const txHash =  await  handleTransfer()
            const valueData =  {
                 payerEmail : values.payerEmail,
                 payerName : values.payerName,
                 payerAddress : {
                  country : values.country,
                  addressLine1 : values.addressLine1,
                  addressLine2 : values.addressLine2,
                   city : values.city,
                   state : values.state,
                   zipCode : values.zipCode

                 },
                 transactionHash : txHash
            }*/
        
            try {
              
              const txHash =  await  handleTransfer2()
              await handleInitiatePayment()
              settxHash(txHash)
              const valueData =  {
                   payerEmail : values.payerEmail,
                   payerName : values.payerName,
                   payerWallet : userMetadata,
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
  
    const handleFetchSession  =   async ()  =>  {
      const res  =  await  axios.get(`${PAY_BASE_URL}session/${sessionId}`)
       return res.data
    }

    const handleFetchCountries  =   async ()  =>  {
        const res  =  await  axios.get(`https://restcountries.com/v3.1/all?fields=name,flags`)
         return res.data
      }

      const {data : countries, isError : isCountriesError, isSuccess : isCountriesSuccess, isLoading : isCountriesLOading, error : countriesErro}  = useQuery({
        queryKey : ['countries'],
        queryFn : handleFetchCountries
       })

    
  
      const {data, isPending, isError, isSuccess, isLoading, error}  = useQuery({
       queryKey : ['sessionData'],
       queryFn : handleFetchSession
      })
  console.log("information", data)



 


    const  SESSION_EXP_TIME =  data?.session?.durationTime
        
  
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
                if(! status   /*testTruth  === "hello"*/  ){
                  return(
                <>
                    <div  className='flex  justify-between items-center  my-4 mb-6'>
                       <h1  className='font-semibold  text-sm lg:text-xl'>  Pay with</h1>
                         
                                <CountdownTimer   expTime={SESSION_EXP_TIME}  />
                           
                         
                    </div>
                 
                   
                  
                 
                 
                  
                    <Accordion type="single" collapsible className="w-full my-4">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>
                          <div  className='flex items-center space-x-2'>
                              <Wallet className='w-5 h-5'  />
                              <p>Wallet</p>
                          </div>
                      </AccordionTrigger>
                      <AccordionContent>
                      <div>
                         {isUser  ?  (
                             <>
                            <Button type="submit" className={`w-full capitalize ${! isUser && "hidden"}`} disabled={isCheckingOut}>{data?.reciever?.labelText ? `${data?.reciever?.labelText} Now` : isCheckingOut ? "Sending.." : "Continue to pay"}</Button>  
                            </>
                         )  :  (
                             <div  className='space-y-2'>
                             <Input type='email'  value={email}  onChange={(e)  =>  setemail(e.target.value)} placeholder='example@gmail.com'  />
                              <Button  className={`w-full `}  > <Mail className="mr-2 h-4 w-4" /> Continue with Email</Button>
                 
                            
                             </div>
                         )}
                      </div>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger>
                         <div  className='flex items-center space-x-2'><QrCode className='w-5 h-5'  />
                         <p>Scan QR  code</p>
                          </div>
                      </AccordionTrigger>
                      <AccordionContent className='flex  items-center justify-center  '>
                         <div  className='my-4  flex  items-center justify-center  flex-col'>
                             <div  className=''>
                      <Canvas
                       text={`${WEBSITE_BASE_URL}payment/checkout-session/${sessionId}`}
                       options={{
                         errorCorrectionLevel: 'M',
                         margin: 2,
                         scale: 20,
                         width: 190,
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
                 </div>
                 
                   <div  className='border  p-3 mt-3 rounded-xl'>
                       <div  className='my-4 '>
                          <h1  className='font-semibold text-sm  lg:text-lg mb-1'>{`Send HBAR  on Hedera network`}</h1>
                           <div className='flex items-center  space-x-1'>
                              <MessageCircleWarningIcon  className='w-3 h-3 text-muted-foreground'  />
                               <p  className='text-xs  text-muted-foreground'>Sending funds on the wrong network or token leads to fund loss.</p>
                           </div>
                       </div>
                       <Button disabled ={isCheckingOut || ! status}  className='w-full '>
                       
                      { status &&  status.status  === "COMPLETED"  && status.sessionId === sessionId ?  (
                        <>
                        <CheckCheckIcon className="mr-2 h-4 w-4" />
                         Payment made succfully
                         </>
                         )  : status &&  status.status  === "FAILED"  && status.sessionId === sessionId? (
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
                
                   
                      

                  
                              
                  
                }  else if(status &&  status.status  === "COMPLETED"  && status.sessionId === sessionId /*testTruth*/ ){
     return(
      <AnimatePresence>
      < motion.div  
      className='flex items-center justify-center  w-full p-5 rounded-xl border  '
      initial={{ y : 10 }}
      transition={{ease : "easeIn", duration : 10}}
      animate={{ y: -10 }}
      exit={{ opacity: 0 }}
      key={"success"}
      >
         <div  className='  w-full items-center justify-center  '>
       

  <div className='border-b pb-6 pt-5 flex flex-col justify-center items-center '>
  <CircleCheckBig  className='w-10 h-10 mb-4 text-green-600' />
      <h1  className='text-xl leading-snug font-semibold text-center'>Payment Confirmed!</h1>
       <h2 className='text-muted-foreground text-xs text-center'>Thank you for your payment.  Your transaction has been securely processed</h2>
  </div>

   <div className=' mt-4  p-2'>
    <div className='flex justify-between w-full my-3'>
      <h3 className='font-semibold text-sm '>Amount</h3>
       <h4 className='text-muted-foreground'>{data?.session.amount}</h4>
    </div>
    <div className='flex justify-between w-full my-3'>
      <h3 className='font-semibold text-sm'>From</h3>
       <h4 className='text-muted-foreground text-sm'>{userMetadata?.publicAddress}</h4>
    </div>
    <div className='flex justify-between w-full my-3'>
      <h3 className='font-semibold text-sm'>To</h3>
       <h4 className='text-muted-foreground text-sm'>{data?.reciever?.userId.wallet  ? data?.reciever?.userId?.wallet  : "-" }</h4>
    </div>
    <div className='flex justify-between w-full my-3'>
      <h3 className='font-semibold text-sm'>Tx hash</h3>
       <h4 className='text-muted-foreground text-sm'>{txHash ?  truncateText(txHash,25,9,9)  : "-"}</h4>
    </div>
     
   </div>

     <div>
       
       <h1 className=' text-xs text-center mt-4 text-muted-foreground hidden'>Weve  emailed your receipt to <span className='text-blue-600'>kabuguabdul2@gmail.com</span></h1>
     </div>
         </div>

      </motion.div>
      </AnimatePresence>
     )
                }else if(status &&  status.status  === "FAILED"  && status.sessionId === sessionId ){
                  return(
                    <AnimatePresence>
                    < motion.div  
                    className='flex items-center justify-center  w-full p-5 rounded-xl border  '
                    initial={{ y : 10 }}
                    transition={{ease : "easeInOut", duration : 2}}
                    animate={{ y: -10 }}
                    exit={{ opacity: 0 }}
                    key={"error"}
                    >
                       <div  className='  w-full items-center justify-center  '>
                     
              
                <div className='border-b pb-6 pt-5 flex flex-col justify-center items-center '>
                <X  className='w-10 h-10 mb-4 text-red-600' />
                    <h1  className='text-xl leading-snug font-semibold text-center'>Oops, Something Went Wrong!</h1>
                     <h2 className='text-muted-foreground text-xs text-center'>Unfortunately, your payment didn’t go through. Please check your balance and try again later, or reach out to our customer support for assistance.</h2>
                </div>
              
                 
              
                   <div>
                     
                     <h1 className=' text-xs text-center mt-4 text-muted-foreground'>Need assistance  contact our customer support</h1>
                   </div>
                       </div>
              
                    </motion.div>
                    </AnimatePresence>
                   )

                }else if( status &&  status.status  === "PENDING"  && status.sessionId === sessionId  /*! testTruth */){
                  return(
                    <AnimatePresence>
                    < motion.div  
                    className='flex items-center justify-center  w-full p-5 rounded-xl border  '
                    initial={{ y : 2 }}
                    transition={{ease : "easeIn", duration : 1}}
                    animate={{ y: -2 }}
                    exit={{ opacity: 0 }}
                    key={"pending"}
                    >
                       <div  className='  w-full items-center justify-center  '>
                     
              
                <div className=' pb-6 pt-5 flex flex-col justify-center items-center '>
                <Loader2  className='w-16 h-16 mb-4 text-blue-500 animate-spin' />
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
      <div className='absolute right-2'> 
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
                    <Image src={"https://pbs.twimg.com/profile_images/1657693585234337792/0Y5Y6bnW_400x400.jpg"} height={100} width={100} alt='token logo' 
                      className='w-4 h-4 rounded-full'
                    />
                     <p>{data?.session?.amount} HBAR</p>
                  </div>

                  <div className='my-5  flex items-center justify-center lg:justify-start lg:items-start'>
                     <Image     src={`/img/messi.png`}  width={300} height={300} alt='product image' className='border w-56 h-52 md:w-72 md:h-80 object-cover'  />
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
