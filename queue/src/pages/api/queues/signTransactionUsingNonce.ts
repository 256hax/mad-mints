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
  "api/queues/signTransactionUsingNonce", // the route it's reachable under
  async (recipient: {
    txBase64: string,
    nonceAccountAuthSecretKeyBase58: string,
    mintSecretKeyBase58: string,
  }) => {
    // Connection
    const connection = getSolanaConnection();

    // Validation
    // txBase64
    const txBase64 = recipient.txBase64;
    if (!txBase64) throw new Error('transactionBase64 not found.');
    // nonceAuthSecretKeyBase58
    const nonceAccountAuthSecretKeyBase58 = recipient.nonceAccountAuthSecretKeyBase58;
    if (!nonceAccountAuthSecretKeyBase58) throw new Error('nonceAccountAuthSecretKeyBase58 not found.');
    // mintSecretKeyBase58
    const mintSecretKeyBase58 = recipient.mintSecretKeyBase58;
    if (!mintSecretKeyBase58) throw new Error('mintSecretKeyBase58 not found.');

    // Payer
    const payerSecretKeyBase58 = process.env.PAYER_SECRET_KEY_BASE58;
    if (!payerSecretKeyBase58) throw new Error('payerSecretKeyBase58 not found.')
    const payer = Keypair.fromSecretKey(bs58.decode(payerSecretKeyBase58));

    // SecretKey convert to KeyPair
    const nonceAccountAuthKeypair = Keypair.fromSecretKey(bs58.decode(nonceAccountAuthSecretKeyBase58));
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
      [payer, nonceAccountAuthKeypair, mintKeypair]
    );

    console.log('signature =>', signature);
  }
);