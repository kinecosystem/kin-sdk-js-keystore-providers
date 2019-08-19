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
const crypto_js_1 = require("crypto-js");
class LocalStorageHandler {
    constructor(_key, _secret) {
        this._key = _key;
        this._secret = _secret;
    }
    refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            let storageString = window.localStorage.getItem(this._key);
            let decrypted = storageString == null ? '[]' : yield this.decrypt(storageString);
            this._storage = JSON.parse(decrypted);
            console.log('decrypted seeds: ' + this._storage);
        });
    }
    clear() {
        window.localStorage.removeItem(this._key);
    }
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.refresh();
            return this._storage;
        });
    }
    set(value) {
        return __awaiter(this, void 0, void 0, function* () {
            let string = JSON.stringify(value);
            window.localStorage.setItem(this._key, yield this.encrypt(string));
        });
    }
    encrypt(value) {
        return Promise.resolve(crypto_js_1.AES.encrypt(value, this._secret).toString());
    }
    decrypt(value) {
        return Promise.resolve(crypto_js_1.AES.decrypt(value, this._secret).toString(crypto_js_1.enc.Utf8));
    }
}
exports.LocalStorageHandler = LocalStorageHandler;
//# sourceMappingURL=local-storage-handler.js.map