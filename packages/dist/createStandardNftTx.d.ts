import { Keypair } from '@solana/web3.js';
import { Metaplex, TransactionBuilder, PublicKey } from '@metaplex-foundation/js';
export declare const createStandardNftTx: (metaplex: Metaplex, mintKeypair: Keypair, tokenOwner: PublicKey) => Promise<TransactionBuilder>;
