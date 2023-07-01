// Lib
import * as bs58 from 'bs58';

// Quirrel
import type { NextApiRequest, NextApiResponse } from 'next';
import signTransactionQueue from "./queues/signTransaction";

// Solana
import {
  Keypair,
} from '@solana/web3.js';

// Modules
import { getSolanaConnection } from 'mad-mints-packages';
import { getMetaplexConnection } from 'mad-mints-packages';
import { airdrop } from 'mad-mints-packages';
import { createStandardNftTx } from 'mad-mints-packages';
import { progressBar } from 'mad-mints-packages';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const connection = getSolanaConnection();

  // Payer
  const payerSecretKeyBase58 = process.env.PAYER_SECRET_KEY_BASE58;
  if (!payerSecretKeyBase58) throw new Error('payerSecretKeyBase58 not found.')
  const payer = Keypair.fromSecretKey(bs58.decode(payerSecretKeyBase58));

  // Minter(Dummy)
  const minter = Keypair.generate();

  // Metaplex
  const metaplex = getMetaplexConnection(connection, payer);

  // Nonce Account creation and minting times for demo.
  // e.g. 10K = 10_000
  const numberOfNonceAccounts = 3;

  // ------------------------------------
  //  Airdrop in Localnet
  // ------------------------------------
  await airdrop(connection, payer.publicKey, 900);

  // ------------------------------------
  //  Create Transaction
  // ------------------------------------
  // Create NFT instructions for demo.
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

    tx.sign(payer);

    // Serialize the transaction and convert to base64 to return it
    const serializedTransaction = tx.serialize({
      // We will need Alice to deserialize and sign the transaction
      requireAllSignatures: false,
    });
    const txBase64 = serializedTransaction.toString('base64');

    // Mint(NFT) KeyPair convert to Base58
    const mintSecretKeyBase58 = bs58.encode(mintKeypair.secretKey);

    const txPayload = ({
      // tx,
      txBase64,
      mintSecretKeyBase58,
    });

    // ------------------------------------
    //  Enqueue
    // ------------------------------------
    // Docs: https://docs.quirrel.dev/api/queue
    await signTransactionQueue.enqueue(
      txPayload,
      {
        id: mintKeypair.publicKey.toString(),
        // delay: "10s",
      }
    );
    res.status(200).end();
    // Note: Can't use res.json.
  }

  console.log('Number of Nonce Accounts =>', numberOfNonceAccounts);
  console.log('payer                    =>', payer.publicKey.toString());
};