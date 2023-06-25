// Quirrel
import type { NextApiRequest, NextApiResponse } from 'next';
import signTransactionQueue from "./queues/signTransaction";

// Solana
import {
  Keypair,
  sendAndConfirmTransaction,
} from '@solana/web3.js';

// Modules
import { getSolanaConnection } from 'mad-mints-packages';
import { getMetaplexConnection } from 'mad-mints-packages';
import { airdrop } from 'mad-mints-packages';
import { createStandardNftTx } from 'mad-mints-packages';
import { progressBar } from 'mad-mints-packages';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const connection = getSolanaConnection();

  const payer = Keypair.generate();

  // Metaplex
  const metaplex = getMetaplexConnection(connection, payer);

  const minter = Keypair.generate();

  // Nonce Account creation and minting times.
  // e.g. 10K = 10_000
  const numberOfNonceAccounts = 3;

  // ------------------------------------
  //  Airdrop in Localnet
  // ------------------------------------
  await airdrop(connection, payer.publicKey, 100);

  // ------------------------------------
  //  Start Speed Test
  // ------------------------------------
  // const startTimeTotal = performance.now();

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

    // ------------------------------------
    //  Enqueue
    // ------------------------------------
    // Docs: https://docs.quirrel.dev/api/queue
    await signTransactionQueue.enqueue(
      signature,
      {
        id: mintKeypair.publicKey.toString(),
        // delay: "10s",
      }
    );
    res.status(200).end();
  }

  // ------------------------------------
  //  End Speed Test
  // ------------------------------------
  // const endTimeTotal = performance.now();
  // console.log('\n/// Speed Test Results ///////////////////////////');
  // console.log('Entire                   =>', endTimeTotal - startTimeTotal, 'ms');
  // console.log('Number of Nonce Accounts =>', numberOfNonceAccounts);
  // console.log('payer                    =>', payer.publicKey.toString());
};