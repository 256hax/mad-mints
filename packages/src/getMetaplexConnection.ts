import {
  Connection,
  Keypair,
} from "@solana/web3.js";

import {
  Metaplex,
  keypairIdentity,
  bundlrStorage,
} from '@metaplex-foundation/js';

export const getMetaplexConnection = (
  connection: Connection,
  keypair: Keypair,
): Metaplex => {
  const metaplex = Metaplex.make(connection)
    .use(keypairIdentity(keypair))
    .use(bundlrStorage({
      address: 'https://devnet.bundlr.network',
      providerUrl: 'https://api.devnet.solana.com',
      timeout: 60000,
    }));
  
  return metaplex;
}