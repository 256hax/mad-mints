// Lib
import * as bs58 from 'bs58';

// Anchor
import * as anchor from '@coral-xyz/anchor';

// Solana
import {
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} from '@solana/web3.js';

// Metaplex
import {
  Metaplex,
  keypairIdentity,
  bundlrStorage,
  toBigNumber,
  OperationOptions,
} from '@metaplex-foundation/js';

// Modules
import { createNonceAccount } from '../app/modules/createNonceAccount';
import { getNonceAccount } from '../app/modules/getNonceAccount';

describe('Mint NFT using Nonce', async () => {
  const provider: any = anchor.AnchorProvider.env(); // type any for provider.wallet.payer.
  anchor.setProvider(provider);
  const connection = provider.connection;

  // Nonce Account Authority
  const secretKey = '3u4caiG9kSfRSySL9a17tJBUPHdAMkapQrKQeDmHZ9oQeh6LgSKyZMgoicpp9eqZ1Z41Gzom6iputb8b2i9DJweC';
  const nonceAccountAuth = Keypair.fromSecretKey(bs58.decode(secretKey));

  // Metaplex
  const metaplex = Metaplex.make(connection)
    .use(keypairIdentity(provider.wallet.payer))
    .use(bundlrStorage({
      address: 'https://devnet.bundlr.network',
      providerUrl: 'https://api.devnet.solana.com',
      timeout: 60000,
    }));

  const payer = provider.wallet.payer;
  let nonceAccount: PublicKey | null;
  let nonce: string;
  const reference = Keypair.generate();
  let signature: string;

  it('Run', async () => {
    // ------------------------------------
    //  Create Nonce Account
    // ------------------------------------
    nonceAccount = await createNonceAccount(
      connection,
      payer,
      nonceAccountAuth.publicKey,
    );

    if (!nonceAccount) throw Error('Nonce Account not found.');

    // ------------------------------------
    //  Get Nonce
    // ------------------------------------
    const nonceAccountInfo = await getNonceAccount(connection, nonceAccount);

    if (!nonceAccountInfo) throw Error('Nonce Account not found.');
    nonce = nonceAccountInfo.nonce;

    // ------------------------------------
    //  Create Instruction
    // ------------------------------------
    let tx = new Transaction();

    // Nonce
    let nonceInstruction = SystemProgram.nonceAdvance({
      noncePubkey: nonceAccount,
      authorizedPubkey: nonceAccountAuth.publicKey,
    });

    // NFT
    // The mint needs to sign the transaction, so we generate a new keypair for it.
    const mintKeypair = Keypair.generate();

    const operationOptions: OperationOptions = {
      commitment: 'confirmed',
    };

    const uri = 'https://arweave.net/rZyxNClGX937dETjo1Pqd8L02uojj9-xuuzqw3K49po'; // Metadata JSON
    const transactionBuilder = await metaplex
      .nfts()
      .builders()
      .create(
        {
          uri: uri,
          name: 'My NFT',
          sellerFeeBasisPoints: 500, // Represents 5.00%.
          maxSupply: toBigNumber(1),
          useNewMint: mintKeypair, // we pass our mint in as the new mint to use
        },
        operationOptions
      );
    const nftInstructions = transactionBuilder.getInstructions();

    // nonce advance must be the first insturction.
    tx.add(nonceInstruction);
    // transactionBuilder have 2 array. Add all of array to tx.
    nftInstructions.forEach(function(insturction) {
      tx.add(insturction)
    });

    // assign `nonce` as recentBlockhash
    tx.recentBlockhash = nonce;
    tx.feePayer = payer.publicKey;

    // ------------------------------------
    //  Sign Transaction
    // ------------------------------------
    tx.sign(
      payer,
      nonceAccountAuth,
      mintKeypair,
    );

    // ------------------------------------
    //  Send Transaction
    // ------------------------------------
    signature = await connection.sendRawTransaction(tx.serialize());

    console.log('mintKeypair.publicKey =>', mintKeypair.publicKey.toString());
    console.log('payer.publicKey =>', payer.publicKey.toString());
    console.log('signature =>', signature);
  });
});
