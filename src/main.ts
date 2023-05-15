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

const main = async () => {
  const connection = new Connection('http://127.0.0.1:8899', 'confirmed');

  const secretKeyAuthBase58 = '3u4caiG9kSfRSySL9a17tJBUPHdAMkapQrKQeDmHZ9oQeh6LgSKyZMgoicpp9eqZ1Z41Gzom6iputb8b2i9DJweC';
  const nonceAccountAuth = Keypair.fromSecretKey(bs58.decode(secretKeyAuthBase58));

  const feePayer = Keypair.generate();

  try {
    await airdrop(connection, feePayer.publicKey);
    const balance = await connection.getBalance(feePayer.publicKey);
    console.log('Balance(Lamports) =>', balance);
  } catch {
    console.log('Airdrop failed.');
  }

  try {
    const [nonceAccount, signature] = await createNonceAccount(
      connection,
      feePayer,
      nonceAccountAuth.publicKey,
    );

    console.log('nonceAccount =>', nonceAccount.toString());
    console.log('signature =>', signature);
  } catch {
    console.log('Failed to create nonce account.');
  }


};

main();