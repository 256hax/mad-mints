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
  PublicKey,
} from '@metaplex-foundation/js';

export const createStandardNftTx = async (
  metaplex: Metaplex,
  mintKeypair: Keypair,
  tokenOwner: PublicKey,
): Promise<TransactionBuilder> => {
  const operationOptions: OperationOptions = {
    commitment: 'confirmed', // If you fail to create Mint Account, set 'finalized' status.
  };

  // Fixed value for speed test.
  const uri: string = 'https://arweave.net/rZyxNClGX937dETjo1Pqd8L02uojj9-xuuzqw3K49po'; // Metadata JSON
  const collection: PublicKey = new PublicKey('J1S9H3QjnRtBbbuD4HjPV6RpRhwuk4zKbxsnCHuTgh9w'); // Collection NFT Address

  // Fixed value for speed test.
  const transactionBuilder: TransactionBuilder = await metaplex
    .nfts()
    .builders()
    .create(
      {
        uri: uri,
        name: 'My NFT',
        sellerFeeBasisPoints: 500, // Represents 5.00%
        maxSupply: toBigNumber(1),
        useNewMint: mintKeypair, // we pass our mint in as the new mint to use
        collection: collection,
        tokenOwner: tokenOwner, // Mint to
      },
      operationOptions
    );

  return transactionBuilder;
};