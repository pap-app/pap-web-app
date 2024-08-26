"use client";
 

import React from "react";
import Hero from "./Hero";
import Features from "./Features";
import { AuroraBackground } from "../ui/aurora-background";
import GetStarted from "./GetStarted";
import Footer from "./Footer";



export default function HomePage() {
  return (
    <div className="w-full ">
   
     <Hero  />
     <Features  />
     <GetStarted  />
     <Footer  />
    


    </div>
  )
}
