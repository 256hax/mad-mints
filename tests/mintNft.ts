// Anchor
import * as anchor from '@coral-xyz/anchor';

// Solana
import {
  Keypair,
  sendAndConfirmTransaction,
} from '@solana/web3.js';

// Metaplex
import {
  toBigNumber,
  OperationOptions,
} from '@metaplex-foundation/js';

// Modules
import { getMetaplexConnection } from '../app/modules/getMetaplexConnection';

describe('Mint NFT without Nonce', async () => {
  const provider: any = anchor.AnchorProvider.env(); // type any for provider.wallet.payer.
  anchor.setProvider(provider);
  const connection = provider.connection;

  // Metaplex
  const metaplex = getMetaplexConnection(connection, provider.wallet.payer);

  const payer = provider.wallet.payer;

  it('Run', async () => {
    // ------------------------------------
    //  Start Speed Test
    // ------------------------------------
    const startTimeTotal = performance.now();
    let startTime: number;
    let endTime: number;

    console.log('--- Speed Bottleneck ------------------------------------');

    // ------------------------------------
    //  Create Instruction
    // ------------------------------------
    // The mint needs to sign the transaction, so we generate a new keypair for it.
    const mintKeypair = Keypair.generate();

    const operationOptions: OperationOptions = {
      commitment: 'confirmed',
    };

    const uri = 'https://arweave.net/rZyxNClGX937dETjo1Pqd8L02uojj9-xuuzqw3K49po'; // Metadata JSON
    const transactionBuilder = await metaplex
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

    // Convert to transaction
    const latestBlockhash = await connection.getLatestBlockhash()
    const transaction = await transactionBuilder.toTransaction(latestBlockhash)

    // Partially sign the transaction, as the shop and the mint.
    // The account is also a required signer, but they'll sign it with their wallet after we return it.
    // transaction.partialSign(wallet);
    transaction.sign(payer);

    const signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [payer, mintKeypair]
    );

    console.log('mintKeypair.publicKey =>', mintKeypair.publicKey.toString());
    console.log('payer.publicKey =>', payer.publicKey.toString());
    console.log('signature =>', signature);
  });
});
