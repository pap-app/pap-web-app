"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { UserContextProvider } from "./poviders/user-context";
import { AutoConnectProvider } from "./aptos-connector/auto-connector";
import { WalletProvider } from "./aptos-connector/wallet-provider";


const queryClient = new QueryClient()
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return  (
    <QueryClientProvider client={queryClient}>
  <NextThemesProvider {...props}>
  <ProgressBar
        height="4px"
        color="#4f46e5"
        options={{ showSpinner: false }}
        shallowRouting
      />
      <UserContextProvider>
        <AutoConnectProvider>
          <WalletProvider>

    {children}
    </WalletProvider>
    </AutoConnectProvider>
    </UserContextProvider>
    </NextThemesProvider>
    </QueryClientProvider>
)}
