// Ref: https://solanacookbook.com/references/offline-transactions.html#durable-nonce
import {
  Connection,
  PublicKey,
  NonceAccount,
} from "@solana/web3.js";

export const getNonceAccount = async (
  connection: Connection,
  nonceAccountPubkey: PublicKey,
): Promise<NonceAccount | null> => {
  const accountInfo = await connection.getAccountInfo(nonceAccountPubkey);

  if (accountInfo) {
    try {
      const nonceAccount = NonceAccount.fromAccountData(accountInfo.data);
      return nonceAccount;
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log('Nonce Account not found. Create Nonce Account first.');
  }

  return null;
};