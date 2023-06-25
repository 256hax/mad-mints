"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSolanaConnection = void 0;
const web3_js_1 = require("@solana/web3.js");
const getSolanaConnection = () => {
    const connection = new web3_js_1.Connection('http://127.0.0.1:8899', 'confirmed');
    return connection;
};
exports.getSolanaConnection = getSolanaConnection;
