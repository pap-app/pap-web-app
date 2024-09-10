import { AptosConfig, Network,Aptos } from '@aptos-labs/ts-sdk'
const aptosConfig = new AptosConfig({ network: Network.TESTNET });

export const aptos = new Aptos(aptosConfig);
