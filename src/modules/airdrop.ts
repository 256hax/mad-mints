import {
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

export const airdrop = async (
  connection: Connection,
  takerPublicKey: PublicKey
) => {
  const latestBlockhash = await connection.getLatestBlockhash();
  const signatureAirdrop = await connection.requestAirdrop(takerPublicKey, LAMPORTS_PER_SOL);

  try {
    await connection.confirmTransaction({
      blockhash: latestBlockhash.blockhash,
      lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
      signature: signatureAirdrop,
    });
  } catch(error) {
    console.log(error);
  }
};