import { AptosConfig, Network,Aptos } from '@aptos-labs/ts-sdk'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import axios from 'axios';
import BigNumber from 'bignumber.js';
import React from 'react'



const aptosConfig = new AptosConfig({ network: Network.TESTNET });

const aptos = new Aptos(aptosConfig);

export default function TestComp() {
    const {account, signAndSubmitTransaction}  = useWallet()
    // Create a BigNumber from a decimal value
const value = new BigNumber("0.1");
// Multiply by 10^8 to convert to a larger integer value
const integerValue = value.multipliedBy(new BigNumber(10).pow(8))

    console.log("the account", integerValue.toString()) 

const RECIEVER  = "0x09d29f0ec5b03fc73b59e35deb80356cde17b13b8db94ded34fc8130dc1da1d9"
      const handleTransferTokens =  async ()  =>   {
        const response = await signAndSubmitTransaction({
          sender: account.address,
          data: {
            function: "0x1::coin::transfer",
            typeArguments: ["0x1::aptos_coin::AptosCoin"],
            functionArguments: [RECIEVER, integerValue.toString()],
          },
        });
        // if you want to wait for transaction

         console.log("the tx response", response)
        try {
          const res = await aptos.waitForTransaction({ transactionHash: response.hash });
           console.log("await response", res)
        } catch (error) {
          console.error(error);
        }

      }


       const  fetchTxState =  async ()  =>  {
        const hash = `0x36e6a07705212dfdfdfc886c91124870461911f0c8beead891cd3e0bffcecb36`
         const url = `https://api.testnet.aptoslabs.com/v1/transactions/by_hash/${hash}`
        const res = await axios.get(url)

          console.log("hash results",   res.data)
       }
  return (
    <div>
      <p>test  sending tokens</p>
      <button className='py-2 px-4 rounded-xl bg-red-400 text-white' onClick={handleTransferTokens}>send apt</button>
      <button className='py-2 px-4 rounded-xl bg-red-400 text-white' onClick={fetchTxState}>get state</button>

    </div>
  )
}
