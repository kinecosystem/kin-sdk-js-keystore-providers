import { DefaultKeyStoreCryptoProvider, IKeyStoreCryptoProvider } from "../libs/CryptoProvider";
import { IKeyStore, KeyStore, KeyStoreType } from "../libs/KeyStore";
import { BaseKeyPair } from "@kinecosystem/kin-sdk-js";

interface KinAccounts {
  [publicAddres: string]: IKeyStore;
}

export abstract class EncryptedStorageProvider {
  private _cryptoProvider: IKeyStoreCryptoProvider;
  private readonly _cachedKinAccounts: KinAccounts;
  private readonly _baseKeyPair: typeof BaseKeyPair;

  protected constructor(baseKeyPair: typeof BaseKeyPair, cryptoProvider?: IKeyStoreCryptoProvider) {
    this._baseKeyPair = baseKeyPair;
    this._cryptoProvider = cryptoProvider || new DefaultKeyStoreCryptoProvider(baseKeyPair);
    this._cachedKinAccounts = {};
  }

  getAccounts(): Promise<string[]> {
    return new Promise(async resolve => {
      await this.get("", "");
      resolve(Object.keys(this._cachedKinAccounts));
    });
  }

  async add(seed: string, secret: string): Promise<boolean> {
    console.log("EncryptedStorageProvider add was firsed");
    const keyPair = this._baseKeyPair.fromSecret(seed);
    const pkey = keyPair.publicKey();

    const salt = await this._cryptoProvider.salt();
    const keyStore = new KeyStore(pkey, salt, seed, KeyStoreType.DECRYPTED);

    const encryptedKeyStore = await this._cryptoProvider.encrypt(keyStore, secret);

    this._cachedKinAccounts[pkey] = keyStore;

    return await this.addHandler(encryptedKeyStore);
  }

  async remove(publicAddress: string): Promise<boolean> {
    const removedKeyStore = { ...this._cachedKinAccounts[publicAddress] };

    const results = await this.removeHandler(removedKeyStore);

    if (results) {
      delete this._cachedKinAccounts[publicAddress];
    }

    return results;
  }

  async get(pkey: string, secret: string): Promise<IKeyStore> {
    const local = this._cachedKinAccounts[pkey];
    if (local) {
      console.log("get local");
      return await this._cryptoProvider.decrypt(local, secret);
    }
    console.log("get remote");
    const remote = await this.getHandler(pkey);
    this._cachedKinAccounts[pkey] = remote;

    return await this._cryptoProvider.decrypt(remote, secret);
  }

  protected abstract addHandler(keyStore: IKeyStore): Promise<boolean>;
  protected abstract removeHandler(keyStore: IKeyStore): Promise<boolean>;
  protected abstract getHandler(publicAddress: string): Promise<IKeyStore>;
}
