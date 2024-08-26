


import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Simplify Payments with Hedera Blockchain",
  description: "Effortless, secure, and scalable payment solutions. Transform your transactions with cutting-edge blockchain technology. Get started today with easy payment links and streamlined invoicing",

}



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
               
   
        {children}
     
        </ThemeProvider>
        
        <Toaster />
        </body>
    </html>
  );
}
