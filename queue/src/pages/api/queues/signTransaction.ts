import { Queue } from "quirrel/next";

export default Queue(
  "api/queues/signTransaction", // the route it's reachable under
  async (recipient: any) => {
    console.log(`Signature: ${recipient}`);
  }
);