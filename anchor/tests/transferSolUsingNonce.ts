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
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';

// Modules
import { createNonceAccount } from 'mad-mints-packages';
import { getNonceAccount } from 'mad-mints-packages';

describe('Transfer SOL using Nonce', async () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const connection = provider.connection;

  // Read None Account Auth Secret Key
  const nonceAccountAuthSecretKeyBase58 = process.env.NONCE_ACCOUNT_AUTH_SECRET_KEY_BASE58;
  if(!nonceAccountAuthSecretKeyBase58) throw Error('nonceAccountAuthSecretKeyBase58 not found.');
  const nonceAccountAuth = Keypair.fromSecretKey(bs58.decode(nonceAccountAuthSecretKeyBase58));

  // @ts-ignore
  const payer = provider.wallet.payer;
  const taker = Keypair.generate();
  let nonceAccount: PublicKey | null;
  let nonce: string;
  let signature: string;

  const addNumberOfAccouns = 10; // Number of times to add accounts.
  const addNumberOfInstructions = 10; // Number of times to add instructions.

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

    // nonce advance must be the first insturction.
    let nonceInstruction = SystemProgram.nonceAdvance({
      noncePubkey: nonceAccount,
      authorizedPubkey: nonceAccountAuth.publicKey,
    });
    tx.add(nonceInstruction);

    // after that, you do what you really want to do, here we append a transfer instruction as an example.
    let txInstruction = SystemProgram.transfer({
      fromPubkey: payer.publicKey,
      toPubkey: taker.publicKey,
      lamports: LAMPORTS_PER_SOL * 0.01,
    });

    // Add Accounts to Instruction
    for (let i = 0; i < addNumberOfAccouns; i++) {
      const reference = Keypair.generate();
      txInstruction.keys.push(
        { pubkey: reference.publicKey, isWritable: false, isSigner: false },
      );
    }

    // Add Instructions
    for (let i = 0; i < addNumberOfInstructions; i++) {
      tx.add(txInstruction);
    }

    // assign `nonce` as recentBlockhash.
    tx.recentBlockhash = nonce;
    tx.feePayer = payer.publicKey;

    ///////////////////////////////////////
    endTime = performance.now();
    console.log('Number of Accounts     =>', addNumberOfAccouns);
    console.log('Number of Instructions =>', addNumberOfInstructions);
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
      nonceAccountAuth
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