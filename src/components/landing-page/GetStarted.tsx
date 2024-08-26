import React from 'react'
import { Button } from '../ui/button'
import { motion } from 'framer-motion'
import Link from 'next/link'
export default function GetStarted() {
  return (
    
         <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="w-full border  max-w-4xl mx-auto p-6 rounded-xl flex flex-col my-9 items-center space-y-2 justify-center "
      >
         <h1 className='font-bold text-xl md:text-2xl text-center ' >No Pain, Only Gain</h1>
          <h2 className='font-extralight text-center text-base md:text-xl dark:text-neutral-200 py-3'>Say goodbye to complex addresses and manual income tracking. <br /> Simplify your finances effortlessly.</h2>
           <Link href={`/login`} className='border py-1.5 px-3 rounded-xl bg-black dark:bg-white text-white dark:text-black'>Get started</Link>

</motion.div>
  )
}
