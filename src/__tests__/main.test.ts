// Lib
import * as bs58 from "bs58";

// Solana
import {
  Connection,
  Keypair,
  PublicKey,
} from "@solana/web3.js";

// Modules
import { airdrop } from "../modules/airdrop";
import { createNonceAccount } from "../modules/createNonceAccount";
import { getNonceAccount } from "../modules/getNonceAccount";

const connection = new Connection('http://127.0.0.1:8899', 'confirmed');

const secretKeyAuthBase58 = '3u4caiG9kSfRSySL9a17tJBUPHdAMkapQrKQeDmHZ9oQeh6LgSKyZMgoicpp9eqZ1Z41Gzom6iputb8b2i9DJweC';
const nonceAccountAuth = Keypair.fromSecretKey(bs58.decode(secretKeyAuthBase58));

const feePayer = Keypair.generate();
let nonceAccount: PublicKey | null;

test('Create Nonce Account', async () => {
  await airdrop(connection, feePayer.publicKey);

  nonceAccount = await createNonceAccount(
    connection,
    feePayer,
    nonceAccountAuth.publicKey,
  );

  if (!nonceAccount) throw Error('Nonce Account not found.');
  expect(nonceAccount).toBeTruthy();

  console.log('nonceAccount =>', nonceAccount.toString());
});

test('Get Nonce Account', async () => {
  if (!nonceAccount) throw Error('Nonce Account not found.');
  const nonceAccountInfo = await getNonceAccount(connection, nonceAccount);

  if (!nonceAccountInfo) throw Error('Nonce Account not found.');
  expect(nonceAccountInfo).toBeTruthy();

  console.log('nonce =>', nonceAccountInfo.nonce);
  console.log('authorityAccount =>', nonceAccountInfo.authorizedPubkey.toString());
});