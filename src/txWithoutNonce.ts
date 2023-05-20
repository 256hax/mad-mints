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
  //  Transfer
  // ------------------------------------
  const startTime = performance.now();

  let tx = new Transaction();
  const blockHash = await connection.getLatestBlockhash();

  let txInstruction = SystemProgram.transfer({
    fromPubkey: payer.publicKey,
    toPubkey: taker.publicKey,
    lamports: LAMPORTS_PER_SOL * 0.01,
  });
  txInstruction.keys.push(
    { pubkey: reference.publicKey, isWritable: false, isSigner: false },
  );

  tx.add(txInstruction);

  tx.recentBlockhash = blockHash.blockhash;
  tx.feePayer = payer.publicKey;
  tx.sign(payer);

  signature = await connection.sendRawTransaction(tx.serialize());

  const endTime = performance.now();

  console.log('Processing Time =>', endTime - startTime, 'ms');
  console.log('signature =>', signature);
};

main();