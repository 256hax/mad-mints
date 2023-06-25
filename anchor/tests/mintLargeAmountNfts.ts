// Anchor
import * as anchor from '@coral-xyz/anchor';

// Solana
import {
  Keypair,
  sendAndConfirmTransaction,
} from '@solana/web3.js';

// Modules
import { getMetaplexConnection } from 'mad-mints-packages';
import { createStandardNftTx } from 'mad-mints-packages';
import { progressBar } from 'mad-mints-packages';

describe('Mint large amount NFTs', async () => {
  const provider = anchor.AnchorProvider.env(); // type any for provider.wallet.payer.
  anchor.setProvider(provider);
  const connection = provider.connection;

  // Metaplex
  // @ts-ignore
  const metaplex = getMetaplexConnection(connection, provider.wallet.payer);

  // @ts-ignore
  const payer = provider.wallet.payer;
  const minter = Keypair.generate();

  // Nonce Account creation and minting times.
  //  e.g. 10K = 10_000
  const numberOfNonceAccounts = 10;

  it('Run', async () => {
    // ------------------------------------
    //  Start Speed Test
    // ------------------------------------
    const startTimeTotal = performance.now();

    console.log('Mint NFTs...');

    for (let i = 0; i < numberOfNonceAccounts; i++) {
      progressBar(i, numberOfNonceAccounts);

      // ------------------------------------
      //  Create Instruction
      // ------------------------------------
      const latestBlockhash = await connection.getLatestBlockhash()

      // NFT
      // The mint needs to sign the transaction, so we generate a new keypair for it.
      const mintKeypair = Keypair.generate();
      const transactionBuilder = await createStandardNftTx(
        metaplex,
        mintKeypair,
        minter.publicKey
      );
      // Convert to transaction
      const tx = await transactionBuilder.toTransaction(latestBlockhash)

      // Partially sign the transaction, as the shop and the mint.
      // The account is also a required signer, but they'll sign it with their wallet after we return it.
      // transaction.partialSign(wallet);
      tx.sign(payer);

      const signature = await sendAndConfirmTransaction(
        connection,
        tx,
        [payer, mintKeypair]
      );
    }

    // ------------------------------------
    //  End Speed Test
    // ------------------------------------
    const endTimeTotal = performance.now();
    console.log('\n/// Speed Test Results ///////////////////////////');
    console.log('Entire                   =>', endTimeTotal - startTimeTotal, 'ms');
    console.log('Number of Nonce Accounts =>', numberOfNonceAccounts);
    console.log('payer                    =>', payer.publicKey.toString());
  });
});