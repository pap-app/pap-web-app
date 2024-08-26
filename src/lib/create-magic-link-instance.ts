
import { HederaExtension } from '@magic-ext/hedera';
import { Magic } from 'magic-sdk';



const createMagic = () => {
    return typeof window != 'undefined' && new Magic('pk_live_C8037E2E6520BBDF', {
        extensions: [
          new HederaExtension({
            network: 'testnet',
          }),
        ],
      });
  };
  
  export const magic = createMagic();