// Lib
import * as bs58 from 'bs58';

// Quirrel
import { Queue } from 'quirrel/next';

// Solana
import {
  Keypair,
  Transaction,
  sendAndConfirmTransaction,
} from '@solana/web3.js';

// Modules
import { getSolanaConnection } from 'mad-mints-packages';

export default Queue(
  "api/queues/signTransaction", // the route it's reachable under
  async (recipient: {
    txBase64: string,
    mintSecretKeyBase58: string,
  }) => {
    // Connection
    const connection = getSolanaConnection();

    // Validation
    // txBase64
    const txBase64 = recipient.txBase64;
    if (!txBase64) throw new Error('transactionBase64 not found.');
    // mintSecretKeyBase58
    const mintSecretKeyBase58 = recipient.mintSecretKeyBase58;
    if (!mintSecretKeyBase58) throw new Error('mintSecretKeyBase58 not found.');

    // Payer
    const payerSecretKeyBase58 = process.env.PAYER_SECRET_KEY_BASE58;
    if (!payerSecretKeyBase58) throw new Error('payerSecretKeyBase58 not found.')
    const payer = Keypair.fromSecretKey(bs58.decode(payerSecretKeyBase58));

    // Mint(NFT) SecretKey convert to KeyPair
    const mintKeypair = Keypair.fromSecretKey(bs58.decode(mintSecretKeyBase58));

    // Recover Transaction
    // The caller of this can convert it back to a transaction object:
    const recoveredTx = Transaction.from(
      Buffer.from(txBase64, 'base64')
    );

    // Send Transaction
    const signature = await sendAndConfirmTransaction(
      connection,
      recoveredTx,
      [payer, mintKeypair]
    );

    console.log('signature =>', signature);
  }
);