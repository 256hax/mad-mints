"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStandardNftTx = void 0;
// Metaplex
const js_1 = require("@metaplex-foundation/js");
const createStandardNftTx = (metaplex, mintKeypair, tokenOwner) => __awaiter(void 0, void 0, void 0, function* () {
    const operationOptions = {
        commitment: 'confirmed', // If you fail to create Mint Account, set 'finalized' status.
    };
    // Fixed value for speed test.
    const uri = 'https://arweave.net/rZyxNClGX937dETjo1Pqd8L02uojj9-xuuzqw3K49po'; // Metadata JSON
    const collection = new js_1.PublicKey('J1S9H3QjnRtBbbuD4HjPV6RpRhwuk4zKbxsnCHuTgh9w'); // Collection NFT Address
    // Fixed value for speed test.
    const transactionBuilder = yield metaplex
        .nfts()
        .builders()
        .create({
        uri: uri,
        name: 'My NFT',
        sellerFeeBasisPoints: 500,
        maxSupply: (0, js_1.toBigNumber)(1),
        useNewMint: mintKeypair,
        collection: collection,
        tokenOwner: tokenOwner, // Mint to
    }, operationOptions);
    return transactionBuilder;
});
exports.createStandardNftTx = createStandardNftTx;
