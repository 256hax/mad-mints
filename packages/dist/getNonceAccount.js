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
exports.getNonceAccount = void 0;
// Ref: https://solanacookbook.com/references/offline-transactions.html#durable-nonce
const web3_js_1 = require("@solana/web3.js");
const getNonceAccount = (connection, nonceAccountPubkey) => __awaiter(void 0, void 0, void 0, function* () {
    const accountInfo = yield connection.getAccountInfo(nonceAccountPubkey);
    if (accountInfo) {
        try {
            const nonceAccount = web3_js_1.NonceAccount.fromAccountData(accountInfo.data);
            return nonceAccount;
        }
        catch (error) {
            console.log(error);
        }
    }
    else {
        console.log('Nonce Account not found. Create Nonce Account first.');
    }
    return null;
});
exports.getNonceAccount = getNonceAccount;
