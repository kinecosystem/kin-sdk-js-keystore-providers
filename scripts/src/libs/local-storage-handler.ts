import { AES, SHA256, enc } from "crypto-js";

export class LocalStorageHandler {
  private _storage: Array<string>;
  private readonly _secret: string;

  constructor(private readonly _key: string, secret: string) {
    this._storage = [];
    this._secret = this.hash(secret);
  }

  /**
   * refresh local _storage object with data from localStorage
   */
  private refresh() {
    let storageString = window.localStorage.getItem(this._key);
    let seeds: Array<string> = JSON.parse(storageString || "[]");
    this._storage = seeds.map(seed => this.decrypt(seed));
  }

  /**
   * remove kin key from localStorage
   */
  public clear() {
    this._storage = [];
    window.localStorage.removeItem(this._key);
  }

  /**
   * get seeds from _storage
   */
  public get() {
    //  refresh _storage before getting it
    this.refresh();
    return this._storage;
  }

  private hash(secret: string) {
    return SHA256(secret).toString();
  }

  /**
   * @param value save new seed to localStorage
   */
  public add(seed: string) {
    this._storage.push(seed);
    let encrypted = this._storage.map(seed => this.encrypt(seed));
    window.localStorage.setItem(this._key, JSON.stringify(encrypted));
  }

  private encrypt(value: string) {
    return AES.encrypt(value, this._secret).toString();
  }

  private decrypt(value: string) {
    return AES.decrypt(value, this._secret).toString(enc.Utf8);
  }
}
