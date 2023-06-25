"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMetaplexConnection = void 0;
const js_1 = require("@metaplex-foundation/js");
const getMetaplexConnection = (connection, keypair) => {
    const metaplex = js_1.Metaplex.make(connection)
        .use((0, js_1.keypairIdentity)(keypair))
        .use((0, js_1.bundlrStorage)({
        address: 'https://devnet.bundlr.network',
        providerUrl: 'https://api.devnet.solana.com',
        timeout: 60000,
    }));
    return metaplex;
};
exports.getMetaplexConnection = getMetaplexConnection;
