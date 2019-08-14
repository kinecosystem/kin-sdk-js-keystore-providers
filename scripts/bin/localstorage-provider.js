"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const KIN_WALLET_STORAGE_INDEX = 'kin_wallet';
class BrowserStorageKeystoreProvider {
    constructor(kinSdk) {
        this.kinSdk = kinSdk;
        this._sdk = kinSdk;
        this._keypairs = new Array();
        this.setKeypairs();
    }
    setKeypairs() {
        let storageString = window.localStorage.getItem(KIN_WALLET_STORAGE_INDEX);
        let seeds = JSON.parse(storageString || '[]');
        if (seeds.length == 0) {
            let keypair = this._sdk.KeyPair.generate();
            this._keypairs.push(keypair);
            this.updateKeyPairsStorage();
            console.log('Stored seed NOT found. Generated new seed:\n' + keypair.seed);
        }
        else {
            for (let seed in seeds) {
                console.log('Stored seed found and loaded:\n' + seed);
                this.addKeyPair(seed);
            }
        }
    }
    updateKeyPairsStorage() {
        let seeds = this._keypairs.map(keypair => keypair.seed);
        window.localStorage.setItem(KIN_WALLET_STORAGE_INDEX, JSON.stringify(seeds));
    }
    addKeyPair(seed) {
        this._keypairs[this._keypairs.length] = this._sdk.KeyPair.fromSeed(seed);
    }
    get accounts() {
        return Promise.resolve(this._keypairs.map(keypay => keypay.publicAddress));
    }
    sign(accountAddress, transactionEnvelpoe) {
        const keypair = this._keypairs[0];
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
exports.BrowserStorageKeystoreProvider = BrowserStorageKeystoreProvider;
window.BrowserStorageKeystoreProvider = BrowserStorageKeystoreProvider;
//# sourceMappingURL=localstorage-provider.js.map