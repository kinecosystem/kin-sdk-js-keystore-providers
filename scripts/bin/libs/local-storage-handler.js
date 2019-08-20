"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_js_1 = require("crypto-js");
class LocalStorageHandler {
    constructor(_key, _secret) {
        this._key = _key;
        this._secret = _secret;
        this._storage = [];
    }
    refresh() {
        let storageString = window.localStorage.getItem(this._key);
        let seeds = JSON.parse(storageString || '[]');
        this._storage = seeds.map(seed => this.decrypt(seed));
    }
    clear() {
        this._storage = [];
        window.localStorage.removeItem(this._key);
    }
    get() {
        this.refresh();
        return this._storage;
    }
    add(seed) {
        this._storage.push(seed);
        let encrypted = this._storage.map(seed => this.encrypt(seed));
        window.localStorage.setItem(this._key, JSON.stringify(encrypted));
    }
    encrypt(value) {
        return crypto_js_1.AES.encrypt(value, this._secret).toString();
    }
    decrypt(value) {
        return crypto_js_1.AES.decrypt(value, this._secret).toString(crypto_js_1.enc.Utf8);
    }
}
exports.LocalStorageHandler = LocalStorageHandler;
//# sourceMappingURL=local-storage-handler.js.map