import * as KinSdk from "@kinecosystem/kin-sdk-js";
import { LocalStorageHandler } from "./libs/localStorageHandler";

declare global {
  interface Window {
    SimpleLocalStorageKeystoreProvider: typeof SimpleLocalStorageKeystoreProvider;
  }
}

const KIN_WALLET_STORAGE_INDEX = "kin-wallet";

export class SimpleLocalStorageKeystoreProvider implements KinSdk.KeystoreProvider {
  private _storage: LocalStorageHandler;

  constructor(private readonly _sdk: typeof KinSdk, secret: string) {
    this._storage = new LocalStorageHandler(KIN_WALLET_STORAGE_INDEX, secret);
  }

  public addKeyPair(seed: string) {
    if (seed == undefined) this._storage.add(this._sdk.KeyPair.generate().seed);
    else this._storage.add(seed);
  }

  get accounts() {
    let seeds = this._storage.get();
    let accounts = seeds.map(seed => this._sdk.KeyPair.fromSeed(seed).publicAddress);
    return Promise.resolve(accounts);
  }

  public async sign(accountAddress: string, transactionEnvelpoe: string) {
    let seeds = await this._storage.get();
    const seed = seeds.find(seed => {
      let tmpAcc = this._sdk.KeyPair.fromSeed(seed);
      if (accountAddress == tmpAcc.publicAddress) return seed;
    });
    if (seed != null) {
      const tx = new this._sdk.XdrTransaction(transactionEnvelpoe);
      const signers = new Array();
      signers.push(this._sdk.BaseKeyPair.fromSecret(seed));
      tx.sign(...signers);
      return Promise.resolve(
        tx
          .toEnvelope()
          .toXDR("base64")
          .toString()
      );
    } else {
      return Promise.reject("keypair null");
    }
  }
}

window.SimpleLocalStorageKeystoreProvider = SimpleLocalStorageKeystoreProvider;
