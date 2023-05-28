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
import { progressBar } from '../app/modules/progressBar';

describe('10K Mint NFTs using Nonce', async () => {
  const provider: any = anchor.AnchorProvider.env(); // type any for provider.wallet.payer.
  anchor.setProvider(provider);
  const connection = provider.connection;

  // Nonce Account Authority. Change to your key.
  const secretKey = '3u4caiG9kSfRSySL9a17tJBUPHdAMkapQrKQeDmHZ9oQeh6LgSKyZMgoicpp9eqZ1Z41Gzom6iputb8b2i9DJweC';
  const nonceAccountAuth = Keypair.fromSecretKey(bs58.decode(secretKey));

  // Metaplex
  const metaplex = getMetaplexConnection(connection, provider.wallet.payer);

  const payer = provider.wallet.payer;
  let nonceAccounts: { publickey: PublicKey, nonce: string }[] = new Array();

  // Nonce Account creation and minting times.
  //  e.g. 10K = 10_000
  const numberOfNonceAccounts = 10;

  it('Run', async () => {
    console.log('Creating Nonce Account...');
    
    for (let i = 0; i <= numberOfNonceAccounts; i++) {
      progressBar(i, numberOfNonceAccounts);

      // ------------------------------------
      //  Create Nonce Account
      // ------------------------------------
      const nonceAccount = await createNonceAccount(
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
      const nonce = nonceAccountInfo.nonce;

      // ------------------------------------
      //  Push Nonce Account to Array
      // ------------------------------------
      const nonceAccountObj = { publickey: nonceAccount, nonce: nonce };
      nonceAccounts.push(nonceAccountObj);
    }

    // ------------------------------------
    //  Start Speed Test
    // ------------------------------------
    const startTimeTotal = performance.now();

    console.log('\nMint NFTs...');

    for (let i = 0; i <= numberOfNonceAccounts; i++) {
      progressBar(i, numberOfNonceAccounts);

      const nonceAccount = nonceAccounts[i].publickey;
      const nonce = nonceAccounts[i].nonce;

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
      await connection.sendRawTransaction(tx.serialize());
    }

    // ------------------------------------
    //  End Speed Test
    // ------------------------------------
    const endTimeTotal = performance.now();
    console.log('\n/// Speed Test Results ///////////////////////////');
    console.log('Entire                   =>', endTimeTotal - startTimeTotal, 'ms');
    console.log('Number of Nonce Acctouns =>', numberOfNonceAccounts);
    console.log('payer                    =>', payer.publicKey.toString());
  });
});
