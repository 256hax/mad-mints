# Queue
Queue system for Mad Mints using Quirrel.

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

### First browser tab(run Scripts):
- [mintLargeAmountNfts](http://localhost:3000/api/mintLargeAmountNfts)
- (WIP)[mintLargeAmountNftsUsingNonce](http://localhost:3000/api/mintLargeAmountNftsUsingNonce)

### Second browser tab(Check Queueing):
- [Quirrel UI](https://ui.quirrel.dev/activity-log)