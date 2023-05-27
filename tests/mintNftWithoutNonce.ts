// Anchor
import * as anchor from '@coral-xyz/anchor';

// Solana
import {
  // Connection,
  // clusterApiUrl,
  Keypair,
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

describe('Mint NFT without Nonce', async () => {
  const provider: any = anchor.AnchorProvider.env(); // type any for provider.wallet.payer.
  anchor.setProvider(provider);
  const connection = provider.connection;

  // Metaplex
  const metaplex = Metaplex.make(connection)
    .use(keypairIdentity(provider.wallet.payer))
    .use(bundlrStorage({
      address: 'https://devnet.bundlr.network',
      providerUrl: 'https://api.devnet.solana.com',
      timeout: 60000,
    }));

  it('Run', async () => {
    // ------------------------------------
    //  Mint NFT
    // ------------------------------------
    // The mint needs to sign the transaction, so we generate a new keypair for it
    const mintKeypair = Keypair.generate();

    // Create a transaction builder to create the NFT
    // Ref: builders: https://metaplex-foundation.github.io/js/classes/js.NftClient.html#builders
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

    // Convert to transaction
    const latestBlockhash = await connection.getLatestBlockhash()
    const transaction = await transactionBuilder.toTransaction(latestBlockhash)

    // Partially sign the transaction, as the shop and the mint
    // The account is also a required signer, but they'll sign it with their wallet after we return it
    // transaction.partialSign(wallet);
    const wallet = provider.wallet.payer;
    transaction.sign(wallet);

    const signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [wallet, mintKeypair]
    );

    console.log('mintKeypair.publicKey =>', mintKeypair.publicKey.toString());
    console.log('wallet.publicKey =>', wallet.publicKey.toString());
    console.log('signature =>', signature);
  });
});
