# Mad Mints
Improves the speed of (minting) transactions. With this approach, you'll be able to handle high demand and experience incredible UX.  

We call "Mad Mints".  

Experimental purpose only. Codes and documents are unofficial, in my opinion.

## Original Source
Quote from [Mad Armani 🎒 Twitter](https://twitter.com/armaniferrante/status/1644755048436736001)

![Tweet](https://github.com/256hax/mad-mints/blob/main/docs/screenshot/armani-tweet.png?raw=true)

He found this approach and named "Mad Mints".

## Summary
[Mad Mints by 256hax Twitter](https://twitter.com/256hax/status/1661189677406208001)

## Documents
Look at following Documents(Power Point).

[Mad Mints Document](https://github.com/256hax/mad-mints/blob/main/docs/Mad-Mints.pptx)

## Setup
```
% yarn
```

## Run (How to speed test)
First terminal:
```
% anchor test
% cd .anchor
% solana-test-validator
```

Please ignore Speed Test Results when you running `anchor test`. Those are not accurate.

Second terminal:
```
% anchor run transferSol
```

```
% anchor run transferSolUsingNonce
```

```
% anchor run mintNft
```

```
% anchor run mintNftUsingNonce
```

```
% anchor run 10kMintNfts
```

```
% anchor run 10kMintNftsUsingNonce
```

## Files
- mintNft.ts: Mint NFT
- mintNftUsingNonce.ts: Mint NFT using Durable Nonce Account
- transferSol.ts: Transfer SOL
- transferSolUsingNonce.ts: Transfer SOL using Durable Nonce Account

## Adjust Config
### Number of times to add accounts/instructions
- transferSol.ts.ts
- transferSolUsingNonce

```
const addNumberOfAccouns = 1; // Number of times to add accounts.
const addNumberOfInstructions = 1; // Number of times to add instructions.
```

### Number of times to creation Nonce Account and mint NFTs
- 10kMintNfts.ts
- 10kMintNftsUsingNonce.ts

```
// Nonce Account creation and minting times.
//  e.g. 10K = 10_000
const numberOfNonceAccounts = 10;
```

## Note
- When `anchor test`, clone Metaplex Programs from Devnet for Mint NFT. If you got a below error, run `anchor test`.
```
Error: failed to send transaction: Transaction simulation failed: Attempt to load a program that does not exist
```