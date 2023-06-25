import { Connection, Keypair } from "@solana/web3.js";
import { Metaplex } from '@metaplex-foundation/js';
export declare const getMetaplexConnection: (connection: Connection, keypair: Keypair) => Metaplex;
