import { Connection, Keypair, PublicKey } from "@solana/web3.js";
export declare const createNonceAccount: (connection: Connection, feePayer: Keypair, nonceAccountAuthPublicKey: PublicKey) => Promise<PublicKey | null>;
