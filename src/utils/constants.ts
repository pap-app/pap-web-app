import {
    IconArrowLeft,
    IconBrandTabler,
    IconSettings,
    IconUserBolt,
    IconHome,
    IconInvoice,
   
  } from "@tabler/icons-react";
import { BadgeDollarSign , Link, House, Settings, LayoutDashboard, Link2, Flame, Code2, TrendingUp} from "lucide-react";




    export const  COUNTRIES  =   "1368|9UrBlZta7RyqMV9Nig0j2mSdeG6kI4vZ7K1SRRt1"


    export const HEDERA_MAINNET  = "https://mainnet.mirrornode.hedera.com/"
    export const HEDERA_TESTNET  = "https://testnet.mirrornode.hedera.com/"
    export const HEDERA_PREVIEW  = "https://preview.mirrornode.hedera.com/"
    export const  HEDERA_LOGO_URL = "https://pbs.twimg.com/profile_images/1556801889282686976/tuHF27-8_400x400.jpg"


    export const WEBSITE_BASE_URL = "https://www.munapay.xyz/"
    export const API_BASE_URL =  "https://got-be.onrender.com/"

 export  const navLinks = [
    {
      label: "Home",
      href: "/dashboard",
      icon:  House
    
    },
    {
      label: "Payments",
      href: "/payment",
      icon:  BadgeDollarSign
    },
    {
      label: "Payment links",
      href: "/payment/payment-links",
      icon: Link ,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: Settings 
    }
  ]


  export const invoicesTest = [
    {
      invoice: "INV001",
      paymentStatus: "Paid",
      totalAmount: "$250.00",
      paymentMethod: "Credit Card",
    },
    {
      invoice: "INV002",
      paymentStatus: "Pending",
      totalAmount: "$150.00",
      paymentMethod: "PayPal",
    },
    {
      invoice: "INV003",
      paymentStatus: "Unpaid",
      totalAmount: "$350.00",
      paymentMethod: "Bank Transfer",
    },
    {
      invoice: "INV004",
      paymentStatus: "Paid",
      totalAmount: "$450.00",
      paymentMethod: "Credit Card",
    },
    {
      invoice: "INV005",
      paymentStatus: "Paid",
      totalAmount: "$550.00",
      paymentMethod: "PayPal",
    },
    {
      invoice: "INV006",
      paymentStatus: "Pending",
      totalAmount: "$200.00",
      paymentMethod: "Bank Transfer",
    },
    {
      invoice: "INV007",
      paymentStatus: "Unpaid",
      totalAmount: "$300.00",
      paymentMethod: "Credit Card",
    },
  ]


  export const features = [
    {
      icone : LayoutDashboard,
      title : "Powerful dashboard",
      description : "Easily manage your payments, API keys, and keep your business running smoothly with our intuitive dashboard.",
    },
    {
      icone : Link2,
      title : "Payment links",
      description : "Generate payment links in seconds and receive payments seamlessly—no fuss, no hassle.",
    },
    {
      icone : IconInvoice,
      title : "Create and Send Invoices with Ease",
      description : "Design professional invoices quickly and manage payments effortlessly—streamlined for your convenience",
    },

    {
      icone : Flame,
      title : "Instant settlement",
      description : "munaPay never holds your funds. They are transferred to your Hedera wallet instantly..",
    },
    {
      icone : Code2,
      title : "Easy and powerful SDKs",
      description : "Quickly integrate with your business in a few lines of code and get your pre-built and hosted checkout page",
    },
    {
      icone : TrendingUp,
      title : "Optimised for conversion",
      description : "Create frictionless checkout experiences with one click payments and QR codes.",
    },
  ]


  export const fakeCustormers =  [
    {
      name :  "miraji",
      email : "blablab@gmail.com"
    },
    {
      name :  "karabu",
      email : "b@gmail.com"
    },
  ]


  export const paymentScheduleDates = [
  {
    title : "today",
    value : "today"
  },
  {
    title : "tomorrow",
    value : "tomorrow"
  },
  {
    title : "7 days",
    value : "next_week"
  },
  {
    title : "1 month",
    value : "next_month"
  },
  ]

  export const currencies =  [
     {
      name : "APTOS",
      value :  "APT"
     },
     {
      name : "USDC",
      value :  "USDC"
     },
  ]


  export const testStatus =  {
    amount: 3,
invoiceId :"66dfec35f727f9e36b2f01e6",
sender: "0x3495bf0e66f2ec6544be2aadf9326bb2dc3e11e33162843b87c705293b783ad8",
status: "COMPLETED", 
txHash: "0xf201e41e6061782c15ec74dc273ffe86a0cc0c077a379cc5662bb75110b58914"
  }

  export const  INVOICE_ABB =  "#XWZHZ1JJK"

  export const MUNA_PAY_INTRO_TEXT = `MunaPay is a payment solution for individuals and organisations to start accepting payments on Hedera. With a low-code solution, mobile-native design, and support for various payment methods, we make it easy for merchants to upgrade their payment system with crypto.`



