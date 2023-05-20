import {
  Connection,
  PublicKey,
} from "@solana/web3.js";

export const watchSignatureStatus = async (
  connection: Connection,
  retry: number,
  closeStatus: string,
  publickey: PublicKey,
) => {
  const sleep = (ms: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  let signatureInfo;
  let confirmationStatus;

  for (let i = 0; i < retry; i++) {
    console.count('Checking for Confirmation Status...');
    signatureInfo = await connection.getSignaturesForAddress(publickey);

    if (signatureInfo[0]) {
      confirmationStatus = signatureInfo[0].confirmationStatus;

      if (signatureInfo[0].confirmationStatus == closeStatus) {
        console.log('Status =>', confirmationStatus);

        return;
      }
    }

    await sleep(10);
  }
};