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

    console.log('\n/// Speed Check Point ///////////////////////////////////////////');

    // ------------------------------------
    //  Create Instruction
    // ------------------------------------
    ///////////////////////////////////////
    startTime = 0, endTime = 0; // Init
    startTime = performance.now();
    ///////////////////////////////////////

    const latestBlockhash = await connection.getLatestBlockhash()

    ///////////////////////////////////////
    endTime = performance.now();
    console.log('Get Latest Block Hash  =>', endTime - startTime, 'ms');
    ///////////////////////////////////////

    ///////////////////////////////////////
    startTime = 0, endTime = 0; // Init
    startTime = performance.now();
    ///////////////////////////////////////

    // The mint needs to sign the transaction, so we generate a new keypair for it.
    const mintKeypair = Keypair.generate();

    const operationOptions: OperationOptions = {
      commitment: 'confirmed', // If you fail to create Mint Account, set 'finalized' status.
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
    const transaction = await transactionBuilder.toTransaction(latestBlockhash)

    ///////////////////////////////////////
    endTime = performance.now();
    console.log('Create Instructions    =>', endTime - startTime, 'ms');
    ///////////////////////////////////////

    ///////////////////////////////////////
    startTime = 0, endTime = 0; // Init
    startTime = performance.now();
    ///////////////////////////////////////

    // Partially sign the transaction, as the shop and the mint.
    // The account is also a required signer, but they'll sign it with their wallet after we return it.
    // transaction.partialSign(wallet);
    transaction.sign(payer);

    ///////////////////////////////////////
    endTime = performance.now();
    console.log('Sign Transactio        =>', endTime - startTime, 'ms');
    ///////////////////////////////////////

    ///////////////////////////////////////
    startTime = 0, endTime = 0; // Init
    startTime = performance.now();
    ///////////////////////////////////////

    const signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [payer, mintKeypair]
    );

    ///////////////////////////////////////
    endTime = performance.now();
    console.log('Send Transaction       =>', endTime - startTime, 'ms');
    ///////////////////////////////////////

    // ------------------------------------
    //  End Speed Test
    // ------------------------------------
    const endTimeTotal = performance.now();
    console.log('\n/// Speed Test Result ///////////////////////////////////////////');
    console.log('Entire                 =>', endTimeTotal - startTimeTotal, 'ms');
    console.log('signature              =>', signature);
  });
});
