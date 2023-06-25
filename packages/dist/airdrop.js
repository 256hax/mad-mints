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
exports.airdrop = void 0;
const web3_js_1 = require("@solana/web3.js");
const airdrop = (connection, takerPublicKey) => __awaiter(void 0, void 0, void 0, function* () {
    const latestBlockhash = yield connection.getLatestBlockhash();
    const signatureAirdrop = yield connection.requestAirdrop(takerPublicKey, web3_js_1.LAMPORTS_PER_SOL);
    try {
        yield connection.confirmTransaction({
            blockhash: latestBlockhash.blockhash,
            lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
            signature: signatureAirdrop,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.airdrop = airdrop;
