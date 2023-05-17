// Ref: https://solanacookbook.com/references/offline-transactions.html#durable-nonce
import {
  Connection,
  Keypair,
  NONCE_ACCOUNT_LENGTH,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
  PublicKey,
} from "@solana/web3.js";

export const createNonceAccount = async (
  connection: Connection,
  feePayer: Keypair,
  nonceAccountAuthPublicKey: PublicKey
): Promise<[PublicKey, string]> => {
  const nonceAccount = Keypair.generate();

  let tx = new Transaction().add(
    // create nonce account
    SystemProgram.createAccount({
      fromPubkey: feePayer.publicKey,
      newAccountPubkey: nonceAccount.publicKey,
      lamports: await connection.getMinimumBalanceForRentExemption(
        NONCE_ACCOUNT_LENGTH
      ),
      space: NONCE_ACCOUNT_LENGTH,
      programId: SystemProgram.programId,
    }),
    // init nonce account
    SystemProgram.nonceInitialize({
      noncePubkey: nonceAccount.publicKey, // nonce account pubkey
      authorizedPubkey: nonceAccountAuthPublicKey, // nonce account authority (for advance and close)
    })
  );
  const signature = await sendAndConfirmTransaction(
    connection,
    tx,
    [feePayer, nonceAccount],
  );

  return [nonceAccount.publicKey, signature];
};