// Lib
import * as bs58 from "bs58";

// Solana
import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

// Modules
import { airdrop } from "./modules/airdrop";
import { createNonceAccount } from "./modules/createNonceAccount";
import { getNonceAccount } from "./modules/getNonceAccount";

const main = async () => {
  const connection = new Connection('http://127.0.0.1:8899', 'confirmed');

  const secretKey = '3u4caiG9kSfRSySL9a17tJBUPHdAMkapQrKQeDmHZ9oQeh6LgSKyZMgoicpp9eqZ1Z41Gzom6iputb8b2i9DJweC';
  const nonceAccountAuth = Keypair.fromSecretKey(bs58.decode(secretKey));

  const payer = Keypair.generate();
  const reference = Keypair.generate();
  const taker = Keypair.generate();
  let nonceAccount: PublicKey | null;
  let nonce: string;
  let signature: string;

  // ------------------------------------
  //  Airdrop to Fee Payer
  // ------------------------------------
  await airdrop(connection, payer.publicKey);

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
  //  Create Instruction
  // ------------------------------------
  let startTimeTotal: number = 0;
  let endTimeTotal: number = 0;
  let startTime: number;
  let endTime: number;

  startTime = performance.now();
  startTimeTotal += startTime;

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

  const executionTimes = 20;
  for (let i = 0; i < executionTimes; i++) {
    tx.add(txInstruction);
  }

  // assign `nonce` as recentBlockhash
  tx.recentBlockhash = nonce;
  tx.feePayer = payer.publicKey;
  tx.sign(
    payer,
    nonceAccountAuth
  );

  endTime = performance.now();
  endTimeTotal += endTime;
  console.log('Create Instruction =>', endTime - startTime, 'ms');

  // ------------------------------------
  //  Send Transaction
  // ------------------------------------
  startTime = 0, endTime = 0; // Init
  startTime = performance.now();
  startTimeTotal += startTime;

  signature = await connection.sendRawTransaction(tx.serialize());

  endTime = performance.now();
  endTimeTotal += endTime;
  console.log('Send Transaction   =>', endTime - startTime, 'ms');

  console.log('------------------------------------------------');
  console.log('Total              =>', endTimeTotal - startTimeTotal, 'ms');
  console.log('signature          =>', signature);
};

main();