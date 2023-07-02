// Lib
import * as bs58 from 'bs58';

// Quirrel
import type { NextApiRequest, NextApiResponse } from 'next';
import signTransactionUsingNonceQueue from "./queues/signTransactionUsingNonce";

// Solana
import {
  Keypair,
  PublicKey,
  Transaction,
  SystemProgram,
} from '@solana/web3.js';

// Modules
import { getSolanaConnection } from 'mad-mints-packages';
import { airdrop } from 'mad-mints-packages';
import { createNonceAccount } from 'mad-mints-packages';
import { getNonceAccount } from 'mad-mints-packages';
import { getMetaplexConnection } from 'mad-mints-packages';
import { createStandardNftTx } from 'mad-mints-packages';
import { progressBar } from 'mad-mints-packages';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const connection = getSolanaConnection();

  // Payer
  const payerSecretKeyBase58 = process.env.PAYER_SECRET_KEY_BASE58;
  if (!payerSecretKeyBase58) throw new Error('payerSecretKeyBase58 not found.')
  const payer = Keypair.fromSecretKey(bs58.decode(payerSecretKeyBase58));

  // Nonce Account Auth
  const nonceAccountAuthSecretKeyBase58 = process.env.NONCE_ACCOUNT_AUTH_SECRET_KEY_BASE58;
  if (!nonceAccountAuthSecretKeyBase58) throw new Error('nonceAccountAuthSecretKeyBase58 not found.')
  const nonceAccountAuth = Keypair.fromSecretKey(bs58.decode(nonceAccountAuthSecretKeyBase58));

  // Nonce Accounnts
  let nonceAccounts: { publickey: PublicKey, nonce: string }[] = new Array();

  // Minter(Dummy)
  const minter = Keypair.generate();

  // Metaplex
  const metaplex = getMetaplexConnection(connection, payer);

  // Nonce Account creation and minting times for demo.
  // e.g. 10K = 10_000
  const numberOfNonceAccounts = 100;

  // ------------------------------------
  //  Airdrop in Localnet
  // ------------------------------------
  await airdrop(connection, payer.publicKey, 900);

  console.log('Creating Nonce Account...');
  for (let i = 0; i < numberOfNonceAccounts; i++) {
    progressBar(i, numberOfNonceAccounts);

    // ------------------------------------
    //  Create Nonce Account
    // ------------------------------------
    const nonceAccount = await createNonceAccount(
      connection,
      payer,
      nonceAccountAuth.publicKey,
    );

    if (!nonceAccount) throw Error('Nonce Account not found.');

    // ------------------------------------
    //  Get Nonce
    // ------------------------------------
    const nonceAccountInfo = await getNonceAccount(connection, nonceAccount);

    if (!nonceAccountInfo) throw Error('Nonce Account not found.');
    const nonce = nonceAccountInfo.nonce;

    // ------------------------------------
    //  Push Nonce Account to Array
    // ------------------------------------
    const nonceAccountObj = { publickey: nonceAccount, nonce: nonce };
    nonceAccounts.push(nonceAccountObj);
  }

  // ------------------------------------
  //  Create Transaction
  // ------------------------------------
  console.log('\nMint NFTs...');

  // Create NFT instructions for demo.
  for (let i = 0; i < numberOfNonceAccounts; i++) {
    progressBar(i, numberOfNonceAccounts);

    const nonceAccount = nonceAccounts[i].publickey;
    const nonce = nonceAccounts[i].nonce;

    // ------------------------------------
    //  Create Instruction
    // ------------------------------------
    let tx = new Transaction();

    // Nonce
    let nonceInstruction = SystemProgram.nonceAdvance({
      noncePubkey: nonceAccount,
      authorizedPubkey: nonceAccountAuth.publicKey,
    });

    // NFT
    // The mint needs to sign the transaction, so we generate a new keypair for it.
    const mintKeypair = Keypair.generate();
    const transactionBuilder = await createStandardNftTx(
      metaplex,
      mintKeypair,
      minter.publicKey
    );
    const nftInstructions = transactionBuilder.getInstructions();

    // nonce advance must be the first insturction.
    tx.add(nonceInstruction);
    // transactionBuilder have 2 array. Add all of array to tx.
    nftInstructions.forEach(function (insturction) {
      tx.add(insturction)
    });

    // assign `nonce` as recentBlockhash
    tx.recentBlockhash = nonce;
    tx.feePayer = payer.publicKey;

    // ------------------------------------
    //  Sign Transaction
    // ------------------------------------
    tx.sign(
      payer,
      nonceAccountAuth,
      mintKeypair,
    );

    // ------------------------------------
    //  Serialize Transaction
    // ------------------------------------
    // Serialize the transaction and convert to base64 to return it
    const serializedTransaction = tx.serialize({
      // We will need Alice to deserialize and sign the transaction
      requireAllSignatures: false,
    });
    const txBase64 = serializedTransaction.toString('base64');

    // Mint(NFT) KeyPair convert to Base58
    const mintSecretKeyBase58 = bs58.encode(mintKeypair.secretKey);

    const txPayload = ({
      txBase64,
      nonceAccountAuthSecretKeyBase58,
      mintSecretKeyBase58,
    });

    // ------------------------------------
    //  Enqueue
    // ------------------------------------
    // Docs: https://docs.quirrel.dev/api/queue
    await signTransactionUsingNonceQueue.enqueue(
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