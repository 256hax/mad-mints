![Mad Mints Logo](https://github.com/256hax/mad-mints/blob/main/docs/logo/mad-mints-logo-160x160.png?raw=true)

# Mad Mints
Improves the speed of minting NFTs transaction. With this approach, you'll be able to handle high demand and experience incredible UX.  

Named "Mad Mints".  

Experimental purpose only. Codes and documents are unofficial, in my opinion.

## Original Source
Quote from [Mad Armani 🎒 Twitter](https://twitter.com/armaniferrante/status/1644755048436736001)

![Tweet](https://github.com/256hax/mad-mints/blob/main/docs/screenshot/armani-tweet.png?raw=true)

He found this approach and named "Mad Mints".  
If you need to ask this brand, please contact to him.

## Compare the speed of Mint Standard and Mad Mints movies
- mint 100 NFTs
- progress 1% = mint 1 NFT

### Standard
completed in 47 sec.  

https://github.com/256hax/mad-mints/assets/1146563/38abf529-3fc3-4eca-90e0-505bbf475bf4

### Mad Mints
completed in 3 sec.  

https://github.com/256hax/mad-mints/assets/1146563/7af218f8-3796-46f0-9310-e1d94f53b519

## Summary
- [Mint NFT conclusion by 256hax Twitter](https://twitter.com/256hax/status/1662963913078734850)
- [Transfer SOL conclusion by 256hax Twitter](https://twitter.com/256hax/status/1661189677406208001)

## Prerequisite
- User scenario: many users(e.g. 10K users) mint an NFT on Mint Site. Provider try to improve transaction speed(UI/UX) when users mint.
- Provider hasn't known Mint Address and User Address in advance.

## Directories
### anchor
Speed test for send transaction(send SOL and mint NFTs) using local validator.  
Check sample codes first.

### queue
Queue system for mint NFT using Quirrel.  
If you need to build queue system, check this.

### packages
Utility scripts(e.g. create durable nonce). Call this packages(specifically dist directory) from anchor and queue scripts.  
Note: this is local npm package(private mode).

### docs
Anatomy of Mad Mints. Conclusion(Pros/Cons and use-case) ,transaction process flow and directory structure of example codes.
[Anatomy of Mad Mints](https://docs.google.com/presentation/d/1BvufeTaRAwPXAxo14YeXZBOUKeqtacLpezLRgxDr_0s/edit?usp=sharing)

## Setup and Run
Look at each directories.

## Note
Please set sleep or retry for rate limit in Mainnet. Make sure to check your Custom RPC.

## Logo
Mad Mints fun art logo by [shiroperu](https://twitter.com/shiroperu).