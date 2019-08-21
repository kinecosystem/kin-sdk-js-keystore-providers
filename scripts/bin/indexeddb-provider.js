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
window.idb = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
const KIN_WALLET_STORAGE = 'kin-wallets';
const KIN_WALLET_STORAGE_BUCKET = 'seeds';
class IndexedDbKeystoreProvider {
    constructor(_sdk) {
        this._sdk = _sdk;
        this._keypairs = new Array();
    }
    static get _idb() {
        return new Promise((resolve, reject) => {
            let idb = window.idb.open(KIN_WALLET_STORAGE, 1);
            idb.onerror = (err) => {
                console.error('something is wrong ' + err);
                reject(err);
            };
            idb.onsuccess = (ev) => {
                console.log('established connection');
                resolve(ev.target.result);
            };
            idb.onupgradeneeded = this.onUpgrade;
        });
    }
    static onUpgrade(ev) {
        console.log('onUpgrade fired');
        let db = ev.target.result;
        db.createObjectStore(KIN_WALLET_STORAGE_BUCKET, { keyPath: "seed" });
    }
    loadKeypairsFromStorage() {
        return new Promise((done) => __awaiter(this, void 0, void 0, function* () {
            let db = yield IndexedDbKeystoreProvider._idb;
            let objectStore = db.transaction(KIN_WALLET_STORAGE_BUCKET).objectStore(KIN_WALLET_STORAGE_BUCKET);
            objectStore.getAll().onsuccess = (ev) => {
                this._keypairs = new Array();
                let results = ev.target.result;
                if (results.length == 0) {
                    console.log('Seed not found');
                }
                else {
                    results.map((result) => {
                        console.log('found stored seed. loading: ' + result.seed);
                        this._keypairs[this._keypairs.length] = this._sdk.KeyPair.fromSeed(result.seed);
                    });
                }
            };
            objectStore.transaction.oncomplete = () => {
                console.log('connection closed');
                db.close();
                done();
            };
            objectStore.transaction.onerror = (err) => {
                console.log('transaction error ' + err);
                db.close();
            };
        }));
    }
    storeKeypairToStorage(keypair) {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            let db = yield IndexedDbKeystoreProvider._idb;
            let objectStore = db.transaction(KIN_WALLET_STORAGE_BUCKET, "readwrite").objectStore(KIN_WALLET_STORAGE_BUCKET);
            objectStore.add({ seed: keypair.seed });
            objectStore.transaction.oncomplete = () => {
                console.log('connection closed');
                db.close();
                resolve();
            };
        }));
    }
    addKeyPair(seed) {
        return __awaiter(this, void 0, void 0, function* () {
            let newKeyPair = seed === undefined ? this._sdk.KeyPair.generate() : this._sdk.KeyPair.fromSeed(seed);
            this._keypairs[this._keypairs.length] = newKeyPair;
            yield this.storeKeypairToStorage(newKeyPair);
        });
    }
    get accounts() {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            console.log('loading keys into memory');
            yield this.loadKeypairsFromStorage();
            resolve(this._keypairs.map(keypair => keypair.publicAddress));
        }));
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
exports.IndexedDbKeystoreProvider = IndexedDbKeystoreProvider;
window.IndexedDbKeystoreProvider = IndexedDbKeystoreProvider;
//# sourceMappingURL=indexeddb-provider.js.map