# Mad Mints
Improves the speed of minting NFTs transaction. With this approach, you'll be able to handle high demand and experience incredible UX.  

Named "Mad Mints".  

Experimental purpose only. Codes and documents are unofficial, in my opinion.

## Original Source
Quote from [Mad Armani 🎒 Twitter](https://twitter.com/armaniferrante/status/1644755048436736001)

![Tweet](https://github.com/256hax/mad-mints/blob/main/docs/screenshot/armani-tweet.png?raw=true)

He found this approach and named "Mad Mints".  
If you need to ask this brand, please contact to him.

## Summary
- [Mint NFT conclusion by 256hax Twitter](https://twitter.com/256hax/status/1662963913078734850)
- [Transfer SOL conclusion by 256hax Twitter](https://twitter.com/256hax/status/1661189677406208001)

## Prerequisite
- User scenario: many users(e.g. 10K users) mint an NFT on Mint Site. Provider try to improve transaction speed(UI/UX) when users mint.
- Provider haven't known Mint Address and User Address in advance.

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
[Anatomy of Mad Mints(Power Point)](https://github.com/256hax/mad-mints/blob/main/docs/Mad-Mints.pptx)

## Setup and Run
Look at each directories.