import { Connection, PublicKey, NonceAccount } from "@solana/web3.js";
export declare const getNonceAccount: (connection: Connection, nonceAccountPubkey: PublicKey) => Promise<NonceAccount | null>;
