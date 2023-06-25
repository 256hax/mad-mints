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
exports.createNonceAccount = void 0;
// Ref: https://solanacookbook.com/references/offline-transactions.html#durable-nonce
const web3_js_1 = require("@solana/web3.js");
const createNonceAccount = (connection, feePayer, nonceAccountAuthPublicKey) => __awaiter(void 0, void 0, void 0, function* () {
    const nonceAccount = web3_js_1.Keypair.generate();
    try {
        let tx = new web3_js_1.Transaction().add(
        // create nonce account
        web3_js_1.SystemProgram.createAccount({
            fromPubkey: feePayer.publicKey,
            newAccountPubkey: nonceAccount.publicKey,
            lamports: yield connection.getMinimumBalanceForRentExemption(web3_js_1.NONCE_ACCOUNT_LENGTH),
            space: web3_js_1.NONCE_ACCOUNT_LENGTH,
            programId: web3_js_1.SystemProgram.programId,
        }), 
        // init nonce account
        web3_js_1.SystemProgram.nonceInitialize({
            noncePubkey: nonceAccount.publicKey,
            authorizedPubkey: nonceAccountAuthPublicKey, // nonce account authority (for advance and close)
        }));
        const signature = yield (0, web3_js_1.sendAndConfirmTransaction)(connection, tx, [feePayer, nonceAccount]);
        return nonceAccount.publicKey;
    }
    catch (error) {
        console.log(error);
    }
    return null;
});
exports.createNonceAccount = createNonceAccount;
