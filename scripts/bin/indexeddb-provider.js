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
const KIN_WALLET_STORAGE = 'kin';
const KIN_WALLET_STORAGE_BUCKET = 'seeds';
class IndexedDbKeystoreProvider {
    constructor(_sdk) {
        this._sdk = _sdk;
        this._keypairs = new Array();
        this.setKeypairsFromStorage();
    }
    static get _idb() {
        return new Promise((resolve, reject) => {
            let idb = window.indexedDB.open(KIN_WALLET_STORAGE, 1);
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
        let objectStore = db.createObjectStore(KIN_WALLET_STORAGE_BUCKET, { keyPath: "ssn" });
        objectStore.createIndex("seed", "seed", { unique: true });
    }
    setKeypairsFromStorage() {
        return __awaiter(this, void 0, void 0, function* () {
            let db = yield IndexedDbKeystoreProvider._idb;
            let objectStore = db.transaction(KIN_WALLET_STORAGE_BUCKET).objectStore(KIN_WALLET_STORAGE_BUCKET);
            objectStore.getAll().onsuccess = (ev) => {
                let seeds = ev.target.result;
                if (seeds.length == 0) {
                    let keypair = this._sdk.KeyPair.generate();
                    this._keypairs.push(keypair);
                    this.storeKeypairsToStorage();
                    console.log('Stored seed NOT found. Generated new seed:\n' + keypair.seed);
                }
                else {
                    console.log(seeds);
                    seeds.map((seed) => {
                        console.log('Stored seed found and loaded: ' + seed);
                        this.addKeyPair(seed);
                    });
                }
            };
            db.close();
        });
    }
    storeKeypairsToStorage() {
        return __awaiter(this, void 0, void 0, function* () {
            let seeds = this._keypairs.map(keypair => keypair.seed);
            let db = yield IndexedDbKeystoreProvider._idb;
            let objectStore = db.transaction(KIN_WALLET_STORAGE_BUCKET, "readwrite").objectStore(KIN_WALLET_STORAGE_BUCKET);
            seeds.map(seed => {
                console.log('Storing seed: ' + seed);
                objectStore.add(seed);
            });
            db.close();
        });
    }
    addKeyPair(seed) {
        return __awaiter(this, void 0, void 0, function* () {
            this._keypairs[this._keypairs.length] = this._sdk.KeyPair.fromSeed(seed);
            this.storeKeypairsToStorage();
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
exports.IndexedDbKeystoreProvider = IndexedDbKeystoreProvider;
window.IndexedDbKeystoreProvider = IndexedDbKeystoreProvider;
//# sourceMappingURL=indexeddb-provider.js.map