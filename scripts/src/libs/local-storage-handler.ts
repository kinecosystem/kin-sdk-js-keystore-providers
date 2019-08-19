import { AES, SHA256, enc } from 'crypto-js';

export class LocalStorageHandler {
    private _storage: any;

    constructor(private readonly _key: string, private readonly _secret: string){}

    /**
     * refresh local _storage object with data from localStorage
     */
    private async refresh() {
        let storageString = window.localStorage.getItem(this._key);
        let decrypted = storageString == null ? '[]' : await this.decrypt(storageString);
        this._storage = JSON.parse(decrypted);
        console.log('decrypted seeds: ' + this._storage);
    }

    /**
     * remove kin key from localStorage
     */
    public clear() {
        window.localStorage.removeItem(this._key);
    }

    /**
     * get seeds from _storage
     */
    public async get() {
        //  refresh _storage before getting it
        await this.refresh();
        return this._storage;
    }

    /**
     * @param value save new seed to localStorage 
     */
    public async set(value: Array<string>) {
        let string = JSON.stringify(value)
        window.localStorage.setItem(this._key, await this.encrypt(string));
    }

    private encrypt(value: string) {
        return Promise.resolve(AES.encrypt(value, this._secret).toString());
    }

    private decrypt(value: string) {
        return Promise.resolve(AES.decrypt(value, this._secret).toString(enc.Utf8));
    }
}