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
} from '@solana/web3.js';

// Modules
import { createNonceAccount } from '../app/modules/createNonceAccount';
import { getNonceAccount } from '../app/modules/getNonceAccount';
import { getMetaplexConnection } from '../app/modules/getMetaplexConnection';
import { createMetaplexTransactionBuilder } from '../app/modules/createMetaplexTransactionBuilder';

describe('Mint NFT using Nonce', async () => {
  const provider: any = anchor.AnchorProvider.env(); // type any for provider.wallet.payer.
  anchor.setProvider(provider);
  const connection = provider.connection;

  // Nonce Account Authority. Change to your key.
  const secretKey = '3u4caiG9kSfRSySL9a17tJBUPHdAMkapQrKQeDmHZ9oQeh6LgSKyZMgoicpp9eqZ1Z41Gzom6iputb8b2i9DJweC';
  const nonceAccountAuth = Keypair.fromSecretKey(bs58.decode(secretKey));

  // Metaplex
  const metaplex = getMetaplexConnection(connection, provider.wallet.payer);

  const payer = provider.wallet.payer;
  let nonceAccount: PublicKey | null;
  let nonce: string;
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
    //  Start Speed Test
    // ------------------------------------
    const startTimeTotal = performance.now();
    let startTime: number;
    let endTime: number;

    console.log('\n/// Speed Check Points ///////////////////////////');

    // ------------------------------------
    //  Create Instruction
    // ------------------------------------
    ///////////////////////////////////////
    startTime = 0, endTime = 0; // Init
    startTime = performance.now();
    ///////////////////////////////////////

    let tx = new Transaction();

    // Nonce
    let nonceInstruction = SystemProgram.nonceAdvance({
      noncePubkey: nonceAccount,
      authorizedPubkey: nonceAccountAuth.publicKey,
    });

    // NFT
    // The mint needs to sign the transaction, so we generate a new keypair for it.
    const mintKeypair = Keypair.generate();
    const transactionBuilder = await createMetaplexTransactionBuilder(metaplex, mintKeypair);
    const nftInstructions = transactionBuilder.getInstructions();

    // nonce advance must be the first insturction.
    tx.add(nonceInstruction);
    // transactionBuilder have 2 array. Add all of array to tx.
    nftInstructions.forEach(function (insturction) {
      tx.add(insturction)
    });

    // assign `nonce` as recentBlockhash
    tx.recentBlockhash = nonce;
    tx.feePayer = payer.publicKey;

    ///////////////////////////////////////
    endTime = performance.now();
    console.log('Create Instructions    =>', endTime - startTime, 'ms');
    ///////////////////////////////////////

    // ------------------------------------
    //  Sign Transaction
    // ------------------------------------
    ///////////////////////////////////////
    startTime = 0, endTime = 0; // Init
    startTime = performance.now();
    ///////////////////////////////////////

    tx.sign(
      payer,
      nonceAccountAuth,
      mintKeypair,
    );

    ///////////////////////////////////////
    endTime = performance.now();
    console.log('Sign Transaction       =>', endTime - startTime, 'ms');
    ///////////////////////////////////////

    // ------------------------------------
    //  Send Transaction
    // ------------------------------------
    ///////////////////////////////////////
    startTime = 0, endTime = 0; // Init
    startTime = performance.now();
    ///////////////////////////////////////

    signature = await connection.sendRawTransaction(tx.serialize());

    ///////////////////////////////////////
    endTime = performance.now();
    console.log('Send Transaction       =>', endTime - startTime, 'ms');
    ///////////////////////////////////////

    // ------------------------------------
    //  End Speed Test
    // ------------------------------------
    const endTimeTotal = performance.now();
    console.log('\n/// Speed Test Results ///////////////////////////');
    console.log('Entire                 =>', endTimeTotal - startTimeTotal, 'ms');
    console.log('signature              =>', signature);
  });
});
