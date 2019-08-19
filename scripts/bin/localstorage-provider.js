"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const local_storage_handler_1 = require("./libs/local-storage-handler");
const KIN_WALLET_STORAGE_INDEX = 'kin-wallet';
const SECRET_KEY = 'my secret key';
class LocalStorageKeystoreProvider {
    constructor(_sdk) {
        this._sdk = _sdk;
        this._keypairs = new Array();
        this._storage = new local_storage_handler_1.LocalStorageHandler(KIN_WALLET_STORAGE_INDEX, SECRET_KEY);
    }
    addKeyPair(seed) {
        return __awaiter(this, void 0, void 0, function* () {
            this._keypairs[this._keypairs.length] = this._sdk.KeyPair.fromSeed(seed);
            let seeds = this._keypairs.map(keypair => keypair.seed);
            this._storage.set(seeds);
        });
    }
    get accounts() {
        return Promise.resolve(this._keypairs.map(keypay => keypay.publicAddress));
    }
    sign(accountAddress, transactionEnvelpoe) {
        const keypair = this._keypairs.find(acc => acc.publicAddress == accountAddress);
        if (keypair != null) {
            const tx = new this._sdk.XdrTransaction(transactionEnvelpoe);
            const signers = new Array();
            signers.push(this._sdk.BaseKeyPair.fromSecret(keypair.seed));
            tx.sign(...signers);
            return Promise.resolve(tx.toEnvelope().toXDR("base64").toString());
        }
        else {
            return Promise.reject("keypair null");
        }
    }
}
exports.LocalStorageKeystoreProvider = LocalStorageKeystoreProvider;
window.LocalStorageKeystoreProvider = LocalStorageKeystoreProvider;
//# sourceMappingURL=localstorage-provider.js.map