"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const KIN_WALLET_STORAGE_INDEX = 'kin_wallet';
class LocalStorageKeystoreProvider {
    constructor(_sdk) {
        this._sdk = _sdk;
        this._keypairs = new Array();
        this.getSeedsFromStorage();
    }
    getSeedsFromStorage() {
        let storageString = window.localStorage.getItem(KIN_WALLET_STORAGE_INDEX);
        let seeds = JSON.parse(storageString || '[]');
        if (seeds.length == 0) {
            let keypair = this._sdk.KeyPair.generate();
            this._keypairs.push(keypair);
            this.updateSeedsStorage();
            console.log('Stored seed NOT found. Generated new seed:\n' + keypair.seed);
        }
        else {
            console.log(seeds);
            seeds.map((seed) => {
                console.log('Stored seed found and loaded: ' + seed);
                this.addKeyPair(seed);
            });
        }
    }
    updateSeedsStorage() {
        let seeds = this._keypairs.map(keypair => keypair.seed);
        window.localStorage.setItem(KIN_WALLET_STORAGE_INDEX, JSON.stringify(seeds));
    }
    addKeyPair(seed) {
        this._keypairs[this._keypairs.length] = this._sdk.KeyPair.fromSeed(seed);
        this.updateSeedsStorage();
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