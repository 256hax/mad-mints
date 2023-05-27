// Anchor
import * as anchor from '@coral-xyz/anchor';

// Solana
import {
  Keypair,
  SystemProgram,
  Transaction,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';

describe('Transfer SOL', async () => {
  const provider: any = anchor.AnchorProvider.env(); // type any for provider.wallet.payer.
  anchor.setProvider(provider);
  const connection = provider.connection;

  const payer = provider.wallet.payer;
  const reference = Keypair.generate();
  const taker = Keypair.generate();
  let signature: string;

  it('Run', async () => {
    // ------------------------------------
    //  Start Speed Test
    // ------------------------------------
    const startTimeTotal = performance.now();
    let startTime: number;
    let endTime: number;

    console.log('\n/// Speed Check Point ///////////////////////////////////////////');

    // ------------------------------------
    //  Get Latest Blockhash
    // ------------------------------------
    ///////////////////////////////////////
    startTime = 0, endTime = 0; // Init
    startTime = performance.now();
    ///////////////////////////////////////

    const blockHash = await connection.getLatestBlockhash();

    ///////////////////////////////////////
    endTime = performance.now();
    console.log('Get Latest Block Hash  =>', endTime - startTime, 'ms');
    ///////////////////////////////////////

    // ------------------------------------
    //  Create Instruction
    // ------------------------------------
    ///////////////////////////////////////
    startTime = 0, endTime = 0; // Init
    startTime = performance.now();
    ///////////////////////////////////////

    let tx = new Transaction();

    let txInstruction = SystemProgram.transfer({
      fromPubkey: payer.publicKey,
      toPubkey: taker.publicKey,
      lamports: LAMPORTS_PER_SOL * 0.01,
    });
    txInstruction.keys.push(
      { pubkey: reference.publicKey, isWritable: false, isSigner: false },
    );

    const executionTimes = 10; // Number of times to add instructions.
    for (let i = 0; i < executionTimes; i++) {
      tx.add(txInstruction);
    }

    tx.feePayer = payer.publicKey;
    tx.recentBlockhash = blockHash.blockhash;

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

    tx.sign(payer);

    ///////////////////////////////////////
    endTime = performance.now();
    console.log('Sign Transactio        =>', endTime - startTime, 'ms');
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
    console.log('\n/// Speed Test Result ///////////////////////////////////////////');
    console.log('Entire                 =>', endTimeTotal - startTimeTotal, 'ms');
    console.log('signature              =>', signature);
  });
});
