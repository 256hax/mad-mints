// Solana
import {
  Connection,
} from "@solana/web3.js";

export const getSolanaConnection = (): Connection => {
  const connection = new Connection('http://127.0.0.1:8899', 'confirmed');
  
  return connection;
}