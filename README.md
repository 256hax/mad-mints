# Mad Mints
Improves the speed of (minting) transactions. With this approach, you'll be able to handle high demand and experience incredible UX.  

We call "Mad Mints".  

Experiment purpose only. Unofficial.

## Original Source
Quote from [Mad Armani 🎒 Twitter](https://twitter.com/armaniferrante/status/1644755048436736001)

```
Tip for anyone building a standard (non-compressed) NFT mint system. Instead of hitting the chain directly,

- allocate 10k durable nonces
- use web2 infra to buffer txs into a queue
- async process the queue one by one

You'll handle crazy bursts and have incredible UX.
```

![Tweet](https://github.com/256hax/mad-mints/blob/main/docs/screenshot/armani-tweet.png?raw=true)

This example codes and documents inspired by above approach.

## Documents
Look at following Documents(Power Point).

[Mad Mints Document](https://github.com/256hax/mad-mints/blob/main/docs/Mad-Mints.pptx)

## Setup
```
% npm i
```

## Run (How to speed test)
First terminal:
```
% solana-test-validator
```

Second terminal:
```
% cd src
% ts-node txUsingNonce.ts

--- Bottleneck in Performance ---------------------------
Sign Transaction   => 4.022541046142578 ms
Send Transaction   => 8.915582060813904 ms
--- Summary ---------------------------------------------
Entire             => 13.952328085899353 ms
signature          => 3ELY4VJNxejf6pBvW5fiHreKrzpUJig4e4jNzMJWw8rGHWL6hkbcnwxJy1JjXqnuHKf1sWnGeoDB6EDvUHZ1Hz16
```

Third terminal:
```
% cd src
% ts-node txWithoutNonce.ts

--- Bottleneck in Performance ---------------------------
Get Latest Blockhash   => 1.366873025894165 ms
Sign Transaction       => 18.401047945022583 ms
Send Transaction       => 7.445399045944214 ms
--- Summary ---------------------------------------------
Entire                 => 28.64971899986267 ms
signature              => 2ykVMFuPhw9cFyJcU5v4gfHdp7ETy6cVUBuk3HDaCTUsyuTqF4GimGVcQeyKHovp8WtYM6FcZdMBkxtcsKGqrP2f
```

- txUsingNonce.ts: Mad Mints
- txWithoutNonce.ts: Standard

Adjust "const executionTimes" then check speed test result.