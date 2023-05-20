// Lib
import * as bs58 from "bs58";

// Solana
import {
  Connection,
  Keypair,
  PublicKey,
  NonceAccount,
  SystemProgram,
  Transaction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

// Modules
import { airdrop } from "./modules/airdrop";
import { createNonceAccount } from "./modules/createNonceAccount";
import { getNonceAccount } from "./modules/getNonceAccount";
import { watchSignatureStatus } from "./modules/watchSignatureStatus";

const main = async () => {
  const connection = new Connection('http://127.0.0.1:8899', 'confirmed');

  const secretKey = '3u4caiG9kSfRSySL9a17tJBUPHdAMkapQrKQeDmHZ9oQeh6LgSKyZMgoicpp9eqZ1Z41Gzom6iputb8b2i9DJweC';
  const nonceAccountAuth = Keypair.fromSecretKey(bs58.decode(secretKey));
  
  const feePayer = Keypair.generate();
  const reference = Keypair.generate();
  let nonceAccount: PublicKey | null;
  let nonce: string;
  let signature: string;

  // ------------------------------------
  //  Airdrop to Fee Payer
  // ------------------------------------
  await airdrop(connection, feePayer.publicKey);

  // ------------------------------------
  //  Create Nonce Account
  // ------------------------------------
  nonceAccount = await createNonceAccount(
    connection,
    feePayer,
    nonceAccountAuth.publicKey,
  );

  if (!nonceAccount) throw Error('Nonce Account not found.');
  console.log('nonceAccount =>', nonceAccount.toString());

  // ------------------------------------
  //  Get Nonce
  // ------------------------------------
  const nonceAccountInfo = await getNonceAccount(connection, nonceAccount);

  if (!nonceAccountInfo) throw Error('Nonce Account not found.');
  nonce = nonceAccountInfo.nonce;
  console.log('nonce =>', nonceAccountInfo.nonce);

  // ------------------------------------
  //  Use Nonce Account
  // ------------------------------------
  let tx = new Transaction();

  // nonce advance must be the first insturction
  let nonceInstruction = SystemProgram.nonceAdvance({
    noncePubkey: nonceAccount,
    authorizedPubkey: nonceAccountAuth.publicKey,
  });

  // after that, you do what you really want to do, here we append a transfer instruction as an example.
  let txInstruction = SystemProgram.transfer({
    fromPubkey: feePayer.publicKey,
    toPubkey: nonceAccountAuth.publicKey,
    lamports: LAMPORTS_PER_SOL * 0.01,
  });
  txInstruction.keys.push(
    { pubkey: reference.publicKey, isWritable: false, isSigner: false },
  );

  tx.add(nonceInstruction);
  tx.add(txInstruction);

  // assign `nonce` as recentBlockhash
  tx.recentBlockhash = nonce;
  tx.feePayer = feePayer.publicKey;
  tx.sign(
    feePayer,
    nonceAccountAuth
  ); /* fee payer + nonce account authority + ... */

  signature = await connection.sendRawTransaction(tx.serialize());

  console.log('feePayer =>', feePayer.publicKey.toString());
  console.log('nonce =>', nonce);
  console.log('authority =>', nonceAccountAuth.publicKey.toString());
  console.log('signature =>', signature);

  // ------------------------------------
  //  Watch Confirmation Status
  // ------------------------------------
  await watchSignatureStatus(
    connection,  // connection
    500, // retry
    'confirmed', // close status
    reference.publicKey, // publickey
  );
  
  console.log('reference =>', reference.publicKey.toString());
};

main();