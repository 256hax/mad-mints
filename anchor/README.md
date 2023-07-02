# anchor

## Setup
### anchor
```
% yarn
```

[Anchor - installation](https://www.anchor-lang.com/docs/installation)

## Run (How to speed test)
First terminal:
```
% anchor test
% cd .anchor
% solana-test-validator
```

Please ignore speed test results if you run `anchor test`. That's not accurate.

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
% anchor run mintLargeAmountNfts
```

```
% anchor run mintLargeAmountNftsUsingNonce
```

## Files
- `transferSol.ts`: Transfer SOL
- `transferSolUsingNonce.ts`: Transfer SOL using Durable Nonce Account
- `mintNft.ts`: Mint NFT
- `mintNftUsingNonce.ts`: Mint NFT using Durable Nonce Account
- `mintLargeAmountNfts.ts`: Mint NFTs with progress bar
- `mintLargeAmountNftsUsingNonce.ts`: Mint NFTs using Durable Nonce Account with progress bar

## Adjust Config
### Number of times to add accounts/instructions
- transferSol.ts.ts
- transferSolUsingNonce

```
const addNumberOfAccouns = 1; // Number of times to add accounts.
const addNumberOfInstructions = 1; // Number of times to add instructions.
```

### Number of times to creation (Nonce) Account and mint NFTs
- mintLargeAmountNfts.ts
- mintLargeAmountNftsUsingNonce.ts

```
// (Nonce) Account creation and minting times.
//  e.g. 10K = 10_000
const numberOfAccounts = 10;
```

Note: Minting 10K NFTs takes a long time. Please adjust minting times.

## Note
- When `anchor test`, clone Metaplex Programs from Devnet for Mint NFT. If you got a below error, run `anchor test`.
```
Error: failed to send transaction: Transaction simulation failed: Attempt to load a program that does not exist
```

## For Mainnet
- Set Custom RPC for connection. Ref: [Metaplex Docs - RPCs Available](https://docs.metaplex.com/resources/rpc-providers#rpcs-available)
- Mint collection NFT before running, and add a verification step at the end.