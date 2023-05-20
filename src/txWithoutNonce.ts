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
  //  Start Speed Test
  // ------------------------------------
  const startTimeTotal = performance.now();
  let startTime: number;
  let endTime: number;

  console.log('--- Bottleneck in Performance ---------------------------');

  // ------------------------------------
  //  Get Latest Blockhash
  // ------------------------------------
  startTime = 0, endTime = 0; // Init
  startTime = performance.now();

  const blockHash = await connection.getLatestBlockhash();

  endTime = performance.now();
  console.log('Get Latest Blockhash   =>', endTime - startTime, 'ms');

  // ------------------------------------
  //  Create Instruction
  // ------------------------------------
  let tx = new Transaction();

  let txInstruction = SystemProgram.transfer({
    fromPubkey: payer.publicKey,
    toPubkey: taker.publicKey,
    lamports: LAMPORTS_PER_SOL * 0.01,
  });
  txInstruction.keys.push(
    { pubkey: reference.publicKey, isWritable: false, isSigner: false },
  );

  const executionTimes = 10;
  for (let i = 0; i < executionTimes; i++) {
    tx.add(txInstruction);
  }

  tx.feePayer = payer.publicKey;
  tx.recentBlockhash = blockHash.blockhash;

  // ------------------------------------
  //  Sign Transaction
  // ------------------------------------
  startTime = 0, endTime = 0; // Init
  startTime = performance.now();

  tx.sign(payer);

  endTime = performance.now();
  console.log('Sign Transaction       =>', endTime - startTime, 'ms');

  // ------------------------------------
  //  Send Transaction
  // ------------------------------------
  startTime = 0, endTime = 0; // Init
  startTime = performance.now();

  signature = await connection.sendRawTransaction(tx.serialize());

  endTime = performance.now();
  console.log('Send Transaction       =>', endTime - startTime, 'ms');

  // ------------------------------------
  //  End Speed Test
  // ------------------------------------
  const endTimeTotal = performance.now();
  console.log('--- Summary ---------------------------------------------');
  console.log('Entire                 =>', endTimeTotal - startTimeTotal, 'ms');
  console.log('signature              =>', signature);
};

main();