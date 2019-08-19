"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class LocalStorageHandler {
    constructor(_key) {
        this._key = _key;
        this.refresh();
    }
    refresh() {
        let storageString = window.localStorage.getItem(this._key);
        this._storage = JSON.parse(storageString || '[]');
    }
    getAll() {
        return this._storage;
    }
    get(key) {
        return this._storage[key];
    }
    set(value) {
        window.localStorage.setItem(this._key, value);
        this.refresh();
    }
}
exports.LocalStorageHandler = LocalStorageHandler;
//# sourceMappingURL=localStorageHandler.js.map