
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
import { AlertCircle, CheckCheckIcon, CircleCheckBig, Loader, Loader2, LoaderPinwheel, Mail, MessageCircleWarningIcon, QrCode, TimerIcon, Wallet, X } from 'lucide-react'
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
export default function CheckOut() {
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
 
    const {toast}  = useToast()
const params =  useParams()
    const  router =  useRouter()
    const sessionId = params.sessionId
  const  PAY_BASE_URL = `https://got-be.onrender.com/pay/`
   const  LOCAL_BASE_URL  = "http://localhost:5000/pay/"
  const { Canvas } = useQRCode();

  
        // 1. Define your form.
        const form = useForm<z.infer<typeof formSchema>>({
            resolver: zodResolver(formSchema),
            defaultValues: {
             payerEmail : "",
             payerName :  "",
             payerAddress : "hedera",
             country  :  "",
             addressLine1  : "",
             addressLine2  : "",
             zipCode  : "",
             
            },
          })
        

              // Initialize socket only once using useEffect
  const socket = io('https://got-be.onrender.com', { autoConnect: false });


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


            //  FETCH  USER  WALLET  INFORMATION

            useEffect(() => {
                magic.user.isLoggedIn().then(async magicIsLoggedIn => {
                  setisUser(magicIsLoggedIn);
                  if (magicIsLoggedIn) {
                    const publicAddress = (await magic.user.getMetadata()).publicAddress;
                    setisUserLoading(false)
                    setPublicAddress(publicAddress);
                    setUserMetadata(await magic.user.getMetadata());
                  }else if(! magicIsLoggedIn){
                    setisUserLoading(false)
                  }
                });

                
              }, [isUser]);

              // FETCH USER WALLET BALANCES

               const handleFetchBalances =  async ()  =>  {

                try {
                    const res  =  await axios.get(`${HEDERA_TESTNET}api/v1/accounts/${publicAddress}`)
                    setbalances(res.data)
                    console.log(res.data)
                     const  BALANCE  = res?.data?.balance?.balance
                     if(BALANCE){
                        const  hbarBalance   =   Hbar.from(BALANCE, HbarUnit.Tinybar)
                        // Convert Hbar to a JavaScript number (e.g., in Hbar or other units)
    const balanceInHbar = hbarBalance.to(HbarUnit.Hbar).toNumber();

                const formattedBalance =   balanceInHbar?.toFixed(2);
                setformattedBalance(formattedBalance)
                     }
                   
                    
                } catch (error) {
                    alert("something went wrong  fetching balance")

                    console.log("error fetch balance", error)
                    
                }
                
               }

                useEffect(() => {
                    if(publicAddress){
                  handleFetchBalances()
                    }
                }, [publicAddress])

                


                //  HANDLE  ON-CHAIN -LOGIN

                const login = async () => {
                    await magic.auth.loginWithEmailOTP({ email });
                    setisUser(true);
                  };

                   // HANDLE ONCHAIN LOG OUT

                   const logout = async () => {
                    await magic.user.logout();
                    setisUser(false);
                  };

                     // RECIEVER  TESTER

                     

                   //  HANDLE  HEDERA  TRANSAFER TOKENS

                   const handleTransfer = async () => {
                    try {
                        const { publicKeyDer } = await magic.hedera.getPublicKey();
                
                        const magicSign = message => magic.hedera.sign(message);
                        const magicWallet = new MagicWallet(publicAddress, new MagicProvider('testnet'), publicKeyDer, magicSign);
                      
                        let transaction = await new TransferTransaction()
                          .setNodeAccountIds([new AccountId(3)])
                          .addHbarTransfer(publicAddress, -1 * data?.session?.amount)
                          .addHbarTransfer(data?.reciever?.userId?.wallet, data?.session?.amount)
                          .freezeWithSigner(magicWallet);
                    
                        transaction = await transaction.signWithSigner(magicWallet);
                        const result = await transaction.executeWithSigner(magicWallet);
                        const receipt = await result.getReceiptWithSigner(magicWallet);
                    
                    
                          console.log("transaction reciepet", receipt)
                    
                          console.log("tx result", result)
                    
                        setSendingTransaction(true);
                    
                        console.log(receipt.status.toString());
                        console.log("tx id",result.transactionId.toString());

                          return  result.transactionId.toString()
                      }
                        
                     catch (error) {
                          toast({
                            variant  : "destructive",
                            title  : "spmething went wrong",
                            description : "something went  wrong please  check you connection and  try aagain"
                          })
                           console.log("transaction part error", error)
                    }}

                    //  HANDLE  HEDERA  TRANSAFER TOKENS

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
                         const  txHash  = await  handleTransfer()
                         console.log("howdy we got tx", txHash)
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
              const txHash =  await  handleTransfer()
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
              const  res  = await  axios.post(`${PAY_BASE_URL}check-out/${sessionId}`,  valueData)
                /* toast({
                  title  : "New ;onk created",
                  description :  "Youve  succefully created new payment link"
                 })*/
                  await   handleSendReciept()
                  
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



       


  

            console.log("the  fromatted balance", formattedBalance1)

              const  getPaymentState =  ()  =>  {
                if(! status && ! isCheckingOut   ){
                  return(
                  <>
                    <div  className='flex  justify-between items-center  my-4 mb-6'>
                       <h1  className='font-semibold  text-sm lg:text-xl'>{data?.reciever?.collectEmail ||  data?.reciever?.collectAddress ||  data?.reciever?.collectName  ?  "Fill  in the  details"   :  "Pay with"}</h1>
                         
                                <CountdownTimer   expTime={SESSION_EXP_TIME}  />
                           
                         
                    </div>
                 
                   
                    {data?.reciever?.collectEmail ||  
                      data?.reciever?.collectName  ||
                      data?.reciever?.collectAddress ?
                    
                      (
                       <div>
                         
                         <h1 className='  font-semibold text-sm my-2  '>Contact  information</h1>
                 
                          
                 
                          <div> 
                             
                          <Form {...form}>
                       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                 
                           {  data?.reciever?.collectName  &&
                         <FormField
                           control={form.control}
                           name="payerName"
                             rules={{
                               required : false
                             }}
                           render={({ field }) => (
                             
                                  <FormItem  className='my-2'>
                               <FormLabel>Name</FormLabel>
                               <FormControl>
                                 <Input type='text' placeholder="kabugu.." {...field} disabled={! isUser} />
                               </FormControl>
                               <FormMessage />
                             </FormItem>      )}/> 
                 
                           }
                 
                 {  data?.reciever?.collectEmail
                   &&
                         <FormField
                           control={form.control}
                           name="payerEmail"
                             rules={{
                               required : false
                             }}
                           render={({ field }) => (
                             
                                  <FormItem  className='my-2'>
                               <FormLabel>Email</FormLabel>
                               <FormControl>
                                 <Input  type='email' placeholder="example@gmail.com" {...field} disabled={! isUser} />
                               </FormControl>
                               <FormMessage />
                             </FormItem>      )}/> 
                 
                           }
                 
                 {  data?.reciever?.collectAddress  &&
                        
                  <div>
                                 <h1 className='mb-2'>Shipping address</h1>
                                   <div>
                 
                                     
                 <FormField
                           control={form.control}
                           name="country"
                           render={({ field }) => (
                 
                             <FormItem className='my-1'>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}  >
                                 <FormControl>
                                   <SelectTrigger>
                                     <SelectValue placeholder="Country" />
                                   </SelectTrigger>
                                 </FormControl>
                                 <SelectContent>
                                   {countries?.map((item, i)  =>  (
                                     <SelectItem value={item.name?.common} key={i}>{item.name.common}</SelectItem>
                                   ))}
                                 </SelectContent>
                               </Select>
                                  
                             </FormItem>
                 
                             
                                        )}/>
                 
                 
                 <FormField
                           control={form.control}
                           name="addressLine1"
                             rules={{
                               required : false
                             }}
                           render={({ field }) => (
                             
                                  <FormItem  className='my-1'>
                               <FormControl>
                                 <Input placeholder="Address line 1" {...field} disabled={! isUser} />
                               </FormControl>
                               <FormMessage />
                             </FormItem>      )}/> 
                 
                             <FormField
                           control={form.control}
                           name="addressLine2"
                             rules={{
                               required : false
                             }}
                           render={({ field }) => (
                             
                                  <FormItem  className='my-1'>
                               <FormControl>
                                 <Input placeholder="address line 2" {...field} disabled={! isUser} />
                               </FormControl>
                               <FormMessage />
                             </FormItem>      )}/> 
                 
                 
                  <div  className='flex  space-x-3'>
                  <FormField
                           control={form.control}
                           name="city"
                             rules={{
                               required : false
                             }}
                           render={({ field }) => (
                             
                                  <FormItem  className='my-1'>
                               
                               <FormControl>
                                 <Input placeholder="City" {...field} disabled={! isUser} />
                               </FormControl>
                               <FormMessage />
                             </FormItem>      )}/> 
                 
                             <FormField
                           control={form.control}
                           name="state"
                             rules={{
                               required : false
                             }}
                           render={({ field }) => (
                             
                                  <FormItem  className='my-1'>
                               
                               <FormControl>
                                 <Input placeholder='State' {...field} disabled={! isUser} />
                               </FormControl>
                               <FormMessage />
                             </FormItem>      )}/> 
                 
                             <FormField
                           control={form.control}
                           name="zipCode"
                             rules={{
                               required : false
                             }}
                           render={({ field }) => (
                             
                                  <FormItem  className='my-1'>
                               
                               <FormControl>
                                 <Input placeholder="zip/pin code" {...field} disabled={! isUser} />
                               </FormControl>
                               <FormMessage />
                             </FormItem>      )}/> 
                  </div>
                 
                 
                                   </div>
                             </div>}
                 
                 
                 <div  className='mt-4'>
                      <p className='  md:font-semibold'>Continue with your preferred payment method</p>
                 </div>
                  
                    <Accordion type="single" collapsible className="w-full">
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
                              <Button  className={`w-full `}  onClick={login}> <Mail className="mr-2 h-4 w-4" /> Continue with Email</Button>
                 
                            
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
                   
                   
                 
                         
                             
                             </form>
                             </Form>
                              </div>
                 
                 
                         
                   </div>
                    )  :  ""}
                           </>
                  )
                }  else if(status &&  status.status  === "COMPLETED"  && status.sessionId === sessionId ){
     return(
      <AnimatePresence>
      < motion.div  
      className='flex items-center justify-center  w-full p-5 rounded-xl border  '
      initial={{ y : 20 }}
      transition={{ease : "easeInOut", duration : 3}}
      animate={{ y: -20 }}
      exit={{ opacity: 0 }}
      key={"success"}
      >
         <div  className='  w-full items-center justify-center  '>
       

  <div className='border-b pb-6 pt-5 flex flex-col justify-center items-center '>
  <CircleCheckBig  className='w-10 h-10 mb-4 text-green-600' />
      <h1  className='text-xl leading-snug font-semibold text-center'>Payment Confirmed!</h1>
       <h2 className='text-muted-foreground text-xs text-center'>Thank you for your payment.  Your transaction has been securely processed</h2>
  </div>

   <div className=' mt-4 border-b pb-4 p-2'>
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
       <h4 className='text-muted-foreground text-sm'>{txHash ? txHash : "-"}</h4>
    </div>
     
   </div>

     <div>
       
       <h1 className=' text-xs text-center mt-4 text-muted-foreground'>Weve  emailed your receipt to <span className='text-blue-600'>kabuguabdul2@gmail.com</span></h1>
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

                }else if( !status && isCheckingOut ){
                  return(
                    <AnimatePresence>
                    < motion.div  
                    className='flex items-center justify-center  w-full p-5 rounded-xl border  '
                    initial={{ y : 5 }}
                    transition={{ease : "easeIn", duration : 2}}
                    animate={{ y: -5 }}
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
    <div className=' max-w-5xl mx-auto    my-4'>
     <OnChainDtaNav walletAddress={userMetadata?.publicAddress} balance={formattedBalance1} />
        <div  className='flex flex-col md:flex-row lg:space-x-1 '>
          <div  className='flex-1  md:h-screen border-b md:border-b-0  border-r    p-6  '>
              <h1  className=' font-bold hidden'>Pay :  <span  className='text-SM font-semibold'>reciever name</span></h1>

               <div  className='my-5'>
                 <h1  className='text-xl  font-semibold my-2'>{data?.reciever?.linkName}</h1>
                  <h2  className='text-muted-foreground text-sm'>{data?.reciever?.description}</h2>
               </div>

                 <div  className='my-5  h-[1.5px]  bg-muted'></div>

                  <div  className='flex  space-x-2  items-center'>
                    <Image src={"https://pbs.twimg.com/profile_images/1657693585234337792/0Y5Y6bnW_400x400.jpg"} height={100} width={100} alt='token logo' 
                      className='w-4 h-4 rounded-full'
                    />
                     <p>{data?.session?.amount} HBAR</p>
                  </div>
          </div>
          <div  className='flex-1   md:h-screen    p-6  '>
            {getPaymentState()}
          </div>
         
          </div>

  

    </div>
  )
}
