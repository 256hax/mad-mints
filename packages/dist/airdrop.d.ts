import { Connection, PublicKey } from "@solana/web3.js";
export declare const airdrop: (connection: Connection, takerPublicKey: PublicKey, sol: number) => Promise<void>;
