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

describe('Mint NFT using Nonce', async () => {
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
  let nonceAccount: PublicKey | null;
  let nonce: string;
  let signature: string;

  it('Run', async () => {
    // ------------------------------------
    //  Create Nonce Account
    // ------------------------------------
    nonceAccount = await createNonceAccount(
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
    nonce = nonceAccountInfo.nonce;

    // ------------------------------------
    //  Start Speed Test
    // ------------------------------------
    const startTimeTotal = performance.now();
    let startTime: number;
    let endTime: number;

    console.log('\n/// Speed Check Points ///////////////////////////');

    // ------------------------------------
    //  Create Instruction
    // ------------------------------------
    ///////////////////////////////////////
    startTime = 0, endTime = 0; // Init
    startTime = performance.now();
    ///////////////////////////////////////

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

    ///////////////////////////////////////
    endTime = performance.now();
    console.log('Create Instructions    =>', endTime - startTime, 'ms');
    ///////////////////////////////////////

    // ------------------------------------
    //  Sign Transaction
    // ------------------------------------
    ///////////////////////////////////////
    startTime = 0, endTime = 0; // Init
    startTime = performance.now();
    ///////////////////////////////////////

    tx.sign(
      payer,
      nonceAccountAuth,
      mintKeypair,
    );

    ///////////////////////////////////////
    endTime = performance.now();
    console.log('Sign Transaction       =>', endTime - startTime, 'ms');
    ///////////////////////////////////////

    // ------------------------------------
    //  Send Transaction
    // ------------------------------------
    ///////////////////////////////////////
    startTime = 0, endTime = 0; // Init
    startTime = performance.now();
    ///////////////////////////////////////

    signature = await connection.sendRawTransaction(tx.serialize());

    ///////////////////////////////////////
    endTime = performance.now();
    console.log('Send Transaction       =>', endTime - startTime, 'ms');
    ///////////////////////////////////////

    // ------------------------------------
    //  End Speed Test
    // ------------------------------------
    const endTimeTotal = performance.now();
    console.log('\n/// Speed Test Results ///////////////////////////');
    console.log('Entire                 =>', endTimeTotal - startTimeTotal, 'ms');
    console.log('signature              =>', signature);
  });
});
