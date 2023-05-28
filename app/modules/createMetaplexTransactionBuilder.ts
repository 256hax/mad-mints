// Solana
import {
  Keypair,
} from '@solana/web3.js';

// Metaplex
import {
  Metaplex,
  toBigNumber,
  OperationOptions,
  TransactionBuilder,
} from '@metaplex-foundation/js';

export const createMetaplexTransactionBuilder = async (
  metaplex: Metaplex,
  mintKeypair: Keypair,
) => {
  const operationOptions: OperationOptions = {
    commitment: 'confirmed', // If you fail to create Mint Account, set 'finalized' status.
  };

  const uri = 'https://arweave.net/rZyxNClGX937dETjo1Pqd8L02uojj9-xuuzqw3K49po'; // Metadata JSON

  const transactionBuilder: TransactionBuilder = await metaplex
    .nfts()
    .builders()
    .create(
      {
        uri: uri,
        name: 'My NFT',
        sellerFeeBasisPoints: 500, // Represents 5.00%.
        maxSupply: toBigNumber(1),
        useNewMint: mintKeypair, // we pass our mint in as the new mint to use
      },
      operationOptions
    );

  return transactionBuilder;
};