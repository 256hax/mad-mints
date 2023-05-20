// Solana
import {
  Connection,
  Keypair,
  SystemProgram,
  Transaction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

// Modules
import { airdrop } from "./modules/airdrop";

const main = async () => {
  const connection = new Connection('http://127.0.0.1:8899', 'confirmed');

  const payer = Keypair.generate();
  const reference = Keypair.generate();
  const taker = Keypair.generate();
  let signature: string;

  // ------------------------------------
  //  Airdrop to Fee Payer
  // ------------------------------------
  await airdrop(connection, payer.publicKey);

  // ------------------------------------
  //  Get Latest Blockhash
  // ------------------------------------
  let startTimeTotal: number = 0;
  let endTimeTotal: number = 0;
  let startTime: number;
  let endTime: number;

  startTime = performance.now();
  startTimeTotal += startTime;

  let tx = new Transaction();
  const blockHash = await connection.getLatestBlockhash();

  endTime = performance.now();
  endTimeTotal += endTime;
  console.log('Get Latest Blockhash   =>', endTime - startTime, 'ms');

  // ------------------------------------
  //  Create Instruction
  // ------------------------------------
  startTime = 0, endTime = 0; // Init
  startTime = performance.now();
  startTimeTotal += startTime;

  let txInstruction = SystemProgram.transfer({
    fromPubkey: payer.publicKey,
    toPubkey: taker.publicKey,
    lamports: LAMPORTS_PER_SOL * 0.01,
  });
  txInstruction.keys.push(
    { pubkey: reference.publicKey, isWritable: false, isSigner: false },
  );

  const executionTimes = 20;
  for (let i = 0; i < executionTimes; i++) {
    tx.add(txInstruction);
  }

  tx.recentBlockhash = blockHash.blockhash;
  tx.feePayer = payer.publicKey;
  tx.sign(payer);

  endTime = performance.now();
  endTimeTotal += endTime;
  console.log('Create Instruction     =>', endTime - startTime, 'ms');

  // ------------------------------------
  //  Send Transaction
  // ------------------------------------
  startTime = 0, endTime = 0; // Init
  startTime = performance.now();
  startTimeTotal += startTime;

  signature = await connection.sendRawTransaction(tx.serialize());

  endTime = performance.now();
  endTimeTotal += endTime;
  console.log('Send Transaction       =>', endTime - startTime, 'ms');

  console.log('------------------------------------------------');
  console.log('Total                  =>', endTimeTotal - startTimeTotal, 'ms');
  console.log('signature              =>', signature);
};

main();