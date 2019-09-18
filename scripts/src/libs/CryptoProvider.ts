import { IKeyStore, KeyStore, KeyStoreType } from "./keyStore";
import * as _sodium from "libsodium-wrappers";
import * as KinSdk from "@kinecosystem/kin-sdk-js-web";

export interface IKeyStoreCryptoProvider {
  encrypt: (keyStore: IKeyStore, secret: string) => Promise<IKeyStore>;
  decrypt: (keyStore: IKeyStore, secret: string) => Promise<IKeyStore>;
  hash: (secret: string, saltStr: string) => Promise<string>;
  salt: () => Promise<string>;
}

const mergeTypedArraysUnsafe = (a: any, b: any) => {
  const c = new a.constructor(a.length + b.length);
  c.set(a);
  c.set(b, a.length);

  return c;
};

export class DefaultKeyStoreCryptoProvider implements IKeyStoreCryptoProvider {
  private _sodium: any;
  private readonly _baseKeyPair: typeof KinSdk.BaseKeyPair;

  constructor(baseKeyPair: typeof KinSdk.BaseKeyPair) {
    this._baseKeyPair = baseKeyPair;
  }

  private async getSodium() {
    if (!this._sodium) {
      await _sodium.ready;
      this._sodium = _sodium;
    }
    return this._sodium;
  }

  async decrypt(keyStore: IKeyStore, secret: string): Promise<IKeyStore> {
    const sodium = await this.getSodium();
    const { pkey, salt, seed } = keyStore;
    const keyHash = await this.hash(secret, salt);

    const nonce_and_ciphertext = sodium.from_hex(seed);

    if (nonce_and_ciphertext.length < sodium.crypto_secretbox_NONCEBYTES + sodium.crypto_secretbox_MACBYTES) {
      throw "Short message";
    }

    const nonce = nonce_and_ciphertext.slice(0, sodium.crypto_secretbox_NONCEBYTES);
    const ciphertext = nonce_and_ciphertext.slice(sodium.crypto_secretbox_NONCEBYTES);
    const decryptedSeedBytes = sodium.crypto_secretbox_open_easy(ciphertext, nonce, keyHash);

    const keyPair = this._baseKeyPair.fromRawEd25519Seed(decryptedSeedBytes.slice(0, 32));

    return new KeyStore(pkey, salt, keyPair.secret(), KeyStoreType.DECRYPTED);
  }

  async encrypt(keyStore: IKeyStore, secret: string): Promise<IKeyStore> {
    const { pkey, salt, seed } = keyStore;

    const sodium = await this.getSodium();
    const keyHash = await this.hash(secret, salt);
    const keyPair = this._baseKeyPair.fromSecret(seed);
    const seedBytes = keyPair.rawSecretKey();

    const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
    const encrypted = sodium.crypto_secretbox_easy(seedBytes, nonce, keyHash);
    const merged = mergeTypedArraysUnsafe(nonce, encrypted);

    let encryptedSeedHex = sodium.to_hex(merged);

    return new KeyStore(pkey, salt, encryptedSeedHex, KeyStoreType.ENCRYPTED);
  }

  async hash(secret: string, saltHex: string): Promise<string> {
    const sodium = await this.getSodium();
    const saltBytes = sodium.from_hex(saltHex);
    const secretBytes = sodium.from_string(secret);
    return sodium.crypto_pwhash(32, secretBytes, saltBytes, 2, 67108864, 2);
  }

  async salt(): Promise<string> {
    const sodium = await this.getSodium();
    return sodium.to_hex(sodium.randombytes_buf(16));
  }
}
