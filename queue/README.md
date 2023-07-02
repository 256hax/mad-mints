# Queue
Queue system for mint NFT using Quirrel.

## Queue System
[Quirrel](https://quirrel.dev/) is Job Queueing for Serverless.  
This is one of queueing example. You can use your favorite queue systems(e.g. Amazon SQS, Rails Delayed Job).

## Setup
```
% npm i
```

## Run
### First terminal(run Queue Server):
```
% npx quirrel
```

### Second terminal(run Next Server):
```
% npm run dev
```

### Third terminal(run Solana Test Validator):
```
% cd mad-mints/anchor/.anchor
% solana-test-validator
```

Note: Setup and run in anchor first. Check README in mad-mints/anchor.

### First browser tab(run Scripts):
- [mintLargeAmountNfts](http://localhost:3000/api/mintLargeAmountNfts)
- [mintLargeAmountNftsUsingNonce](http://localhost:3000/api/mintLargeAmountNftsUsingNonce)

### Second browser tab(Check Queueing):
- [Quirrel UI](https://ui.quirrel.dev/activity-log)

## Adjust Config
### Number of times to creation (Nonce) Account and mint NFTs
- mintLargeAmountNfts.ts
- mintLargeAmountNftsUsingNonce.ts

```
// (Nonce) Account creation and minting times.
//  e.g. 10K = 10_000
const numberOfAccounts = 3;
```