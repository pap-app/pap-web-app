"use client"

import { WalletSelector } from '@/components/aptos-connector/wallet-selector'
import TestComp from '@/components/test-components/test-comp'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import React from 'react'

export default function page() {
  
  return (
    <div>
      hello  world

      <div>
        <WalletSelector  />
      </div>
      <div>
        <TestComp />
      </div>
    </div>
  )
}
