// Lib
import 'dotenv/config';
import * as bs58 from 'bs58';

// Anchor
import * as anchor from '@coral-xyz/anchor';

// Solana
import {
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';

// Mad Mints
import { createNonceAccount } from 'mad-mints-packages';
import { getNonceAccount } from 'mad-mints-packages';
import { getMetaplexConnection } from 'mad-mints-packages';
import { createStandardNftTx } from 'mad-mints-packages';
import { progressBar } from 'mad-mints-packages';

describe('Mint large amount NFTs using Nonce', async () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const connection = provider.connection;

  // Read None Account Auth Secret Key
  const nonceAccountAuthSecretKeyBase58 = process.env.NONCE_ACCOUNT_AUTH_SECRET_KEY_BASE58;
  if(!nonceAccountAuthSecretKeyBase58) throw Error('nonceAccountAuthSecretKeyBase58 not found.');
  const nonceAccountAuth = Keypair.fromSecretKey(bs58.decode(nonceAccountAuthSecretKeyBase58));

  // Metaplex
  // @ts-ignore
  const metaplex = getMetaplexConnection(connection, provider.wallet.payer);

  // @ts-ignore
  const payer = provider.wallet.payer;
  const minter = Keypair.generate();
  let nonceAccounts: { publickey: PublicKey, nonce: string }[] = new Array();

  // (Nonce) Account creation and minting times.
  //  e.g. 10K = 10_000
  const numberOfAccounts = 10;

  it('Run', async () => {
    // ------------------------------------
    //  Create Nonce Accounts
    // ------------------------------------
    console.log('Creating Nonce Account...');

    for (let i = 0; i < numberOfAccounts; i++) {
      progressBar(i, numberOfAccounts);

      // ------------------------------------
      //  Create a Nonce Account
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
    //  Start Speed Test
    // ------------------------------------
    const startTimeTotal = performance.now();

    console.log('\nMint NFTs...');

    // ------------------------------------
    //  Create Transactions
    // ------------------------------------
    for (let i = 0; i < numberOfAccounts; i++) {
      progressBar(i, numberOfAccounts);

      const nonceAccount = nonceAccounts[i].publickey;
      const nonce = nonceAccounts[i].nonce;

      // ------------------------------------
      //  Create an Instruction
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
      //  Send Transaction
      // ------------------------------------
      await connection.sendRawTransaction(tx.serialize());
    }

    // ------------------------------------
    //  End Speed Test
    // ------------------------------------
    const endTimeTotal = performance.now();
    console.log('\n/// Speed Test Results ///////////////////////////');
    console.log('Entire             =>', endTimeTotal - startTimeTotal, 'ms');
    console.log('Number of Accounts =>', numberOfAccounts);
    console.log('payer              =>', payer.publicKey.toString());
  });
});
