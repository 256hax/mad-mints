# Mad Mints
Improves the speed of (minting) transactions. With this approach, you'll be able to handle high demand and experience incredible UX.  

We call "Mad Mints".  

Experimental purpose only. Codes and documents are unofficial. My personal opinion.

## Original Source
Quote from [Mad Armani 🎒 Twitter](https://twitter.com/armaniferrante/status/1644755048436736001)

![Tweet](https://github.com/256hax/mad-mints/blob/main/docs/screenshot/armani-tweet.png?raw=true)

This example codes and documents inspired by above approach.

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
```
% anchor test

  Mint NFT

/// Speed Check Point ///////////////////////////////////////////
Get Latest Block Hash  => 11.494064033031464 ms
Create Instructions    => 13.724269986152649 ms
Sign Transactio        => 16.91003704071045 ms
Send Transaction       => 299.94438004493713 ms

/// Speed Test Result ///////////////////////////////////////////
Entire                 => 342.9058340191841 ms
signature              => hQepRrm8vEaQCkeaTQtdcnCE4wCMwsJrsQrKHHiVSPDshFQ2LjSydvdRuYgrRU5imbZBMhRNsmZGYxg9HsFkxVP
    ✔ Run (343ms)

  Mint NFT using Nonce

/// Speed Check Point ///////////////////////////////////////////
Create Instructions    => 3.5406439900398254 ms
Sign Transactio        => 4.094771027565002 ms
Send Transaction       => 15.202999949455261 ms

/// Speed Test Result ///////////////////////////////////////////
Entire                 => 23.147826969623566 ms
signature              => 21QyNb2eWQgRG8y91eskqZBxp2acmxPkP4Fu2iRf4rBit7KD52V195DJAWwNto2VhdLy2cpDtmXNeAFYAqufM1Vk
    ✔ Run (486ms)

  Transfer SOL

/// Speed Check Point ///////////////////////////////////////////
Get Latest Block Hash  => 2.205308973789215 ms
Create Instructions    => 0.2555369734764099 ms
Sign Transactio        => 1.9137240052223206 ms
Send Transaction       => 4.917131006717682 ms

/// Speed Test Result ///////////////////////////////////////////
Entire                 => 9.806727051734924 ms
signature              => 3HBgC6HMyu9frGZH2wMmwMZm3vxu4PbQkvszwBcvCC6woPcR5F8bBcbHbVEvX2vtj1ztMohpeczwuGH5UEmkBmLB
    ✔ Run

  Transfer SOL using Nonce

/// Speed Check Point ///////////////////////////////////////////
Create Instructions    => 0.1617879867553711 ms
Sign Transactio        => 4.116273999214172 ms
Send Transaction       => 8.314706981182098 ms

/// Speed Test Result ///////////////////////////////////////////
Entire                 => 12.882879972457886 ms
signature              => 56yBErmZVY6iXd4pEyB7qwjYmp6PkAPV4WZkcBvBv9DrZ9z921Zvip6fPVniqsLtQnhLTMYFzT2jErs18vj7tT5V
    ✔ Run (430ms)


  4 passing (1s)

✨  Done in 3.92s.
```

## Files
- mintNft.ts: Mint NFT
- mintNftusingNonce.ts: Mint NFT using Durable Nonce Account
- transferSol.ts: Transfer SOL
- transferSolUsingNonce.ts: Transfer SOL using Durable Nonce Account

## Adjust Config
You can change number of times to add instructions. Default: 10
- transferSol.ts.ts
- transferSolUsingNonce

```
const executionTimes = 10; // Number of times to add instructions.
```

## Note
- When `anchor test`, clone Metaplex Programs from Devnet for Mint NFT.
- If you need to use Solana Explorer with Custom RPC URL, run following.

```
% anchor test
% cd .anchor
% solana-test-validator
```

Then access [Solana Explorer](https://explorer.solana.com/?cluster=custom).