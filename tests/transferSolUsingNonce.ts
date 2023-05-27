// Lib
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
import { createNonceAccount } from '../app/modules/createNonceAccount';
import { getNonceAccount } from '../app/modules/getNonceAccount';

describe('Transfer SOL using Nonce', async () => {
  const provider: any = anchor.AnchorProvider.env(); // type any for provider.wallet.payer.
  anchor.setProvider(provider);
  const connection = provider.connection;

  // Nonce Account Authority
  const secretKey = '3u4caiG9kSfRSySL9a17tJBUPHdAMkapQrKQeDmHZ9oQeh6LgSKyZMgoicpp9eqZ1Z41Gzom6iputb8b2i9DJweC';
  const nonceAccountAuth = Keypair.fromSecretKey(bs58.decode(secretKey));

  const payer = provider.wallet.payer;
  const reference = Keypair.generate();
  const taker = Keypair.generate();
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

    console.log('--- Bottleneck in Performance ---------------------------');

    // ------------------------------------
    //  Create Instruction
    // ------------------------------------
    let tx = new Transaction();

    // nonce advance must be the first insturction
    let nonceInstruction = SystemProgram.nonceAdvance({
      noncePubkey: nonceAccount,
      authorizedPubkey: nonceAccountAuth.publicKey,
    });

    // after that, you do what you really want to do, here we append a transfer instruction as an example.
    let txInstruction = SystemProgram.transfer({
      fromPubkey: payer.publicKey,
      toPubkey: taker.publicKey,
      lamports: LAMPORTS_PER_SOL * 0.01,
    });
    // Use for get confirmation status.
    txInstruction.keys.push(
      { pubkey: reference.publicKey, isWritable: false, isSigner: false },
    );

    tx.add(nonceInstruction);

    const executionTimes = 10; // Number of times to add instructions.
    for (let i = 0; i < executionTimes; i++) {
      tx.add(txInstruction);
    }

    // assign `nonce` as recentBlockhash
    tx.recentBlockhash = nonce;
    tx.feePayer = payer.publicKey;

    // ------------------------------------
    //  Sign Transaction
    // ------------------------------------
    startTime = 0, endTime = 0; // Init
    startTime = performance.now();

    tx.sign(
      payer,
      nonceAccountAuth
    );

    endTime = performance.now();
    console.log('Sign Transaction   =>', endTime - startTime, 'ms');

    // ------------------------------------
    //  Send Transaction
    // ------------------------------------
    startTime = 0, endTime = 0; // Init
    startTime = performance.now();

    signature = await connection.sendRawTransaction(tx.serialize());

    endTime = performance.now();
    console.log('Send Transaction   =>', endTime - startTime, 'ms');

    // ------------------------------------
    //  End Speed Test
    // ------------------------------------
    const endTimeTotal = performance.now();
    console.log('--- Summary ---------------------------------------------');
    console.log('Entire             =>', endTimeTotal - startTimeTotal, 'ms');
    console.log('signature          =>', signature);
  });
});