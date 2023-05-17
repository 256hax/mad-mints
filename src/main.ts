// Lib
import * as bs58 from "bs58";

// Solana
import {
  Connection,
  Keypair,
  PublicKey,
} from "@solana/web3.js";

// Modules
import { airdrop } from "./modules/airdrop";
import { createNonceAccount } from "./modules/createNonceAccount";
import { getNonceAccount } from "./modules/getNonceAccount";

const main = async () => {
  const connection = new Connection('http://127.0.0.1:8899', 'confirmed');

  const secretKeyAuthBase58 = '3u4caiG9kSfRSySL9a17tJBUPHdAMkapQrKQeDmHZ9oQeh6LgSKyZMgoicpp9eqZ1Z41Gzom6iputb8b2i9DJweC';
  const nonceAccountAuth = Keypair.fromSecretKey(bs58.decode(secretKeyAuthBase58));

  const feePayer = Keypair.generate();

  await airdrop(connection, feePayer.publicKey);

  const nonceAccount = await createNonceAccount(
    connection,
    feePayer,
    nonceAccountAuth.publicKey,
  );
  if(!nonceAccount) throw Error('Nonce Account not found.');
  console.log('nonceAccount =>', nonceAccount.toString());

  const regetNonceAccount = await getNonceAccount(connection, nonceAccount);
  if(!regetNonceAccount) throw Error('Nonce Account not found.');
  console.log('nonce =>', regetNonceAccount.nonce);
  console.log('authorityAccount =>', regetNonceAccount.authorizedPubkey.toString());
};

main();