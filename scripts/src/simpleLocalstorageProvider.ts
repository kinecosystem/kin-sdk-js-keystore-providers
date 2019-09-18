import * as KinSdk from "@kinecosystem/kin-sdk-js-web";
import { LocalStorageHandler } from "./libs/localStorageHandler";
import { Environment } from "@kinecosystem/kin-sdk-js-common";

declare global {
  interface Window {
    SimpleLocalStorageKeystoreProvider: typeof SimpleLocalStorageKeystoreProvider;
  }
}

const KIN_WALLET_STORAGE_INDEX = "kin-wallet";

export class SimpleLocalStorageKeystoreProvider
  implements KinSdk.KeystoreProvider {
  private _storage: LocalStorageHandler;

  constructor(private readonly baseSdk: typeof KinSdk.BaseSdk, secret: string) {
    this._storage = new LocalStorageHandler(KIN_WALLET_STORAGE_INDEX, secret);
  }

  public addKeyPair(seed: string) {
    if (seed == undefined)
      this._storage.add(this.baseSdk.Keypair.random().secret());
    else this._storage.add(seed);
  }

  get publicAddresses() {
    let seeds = this._storage.get();
    let accounts = seeds.map(seed =>
      this.baseSdk.Keypair.fromSecret(seed).publicKey()
    );
    return Promise.resolve(accounts);
  }

  public async sign(transactionEnvelpoe: string, ...accountAddress: string[]) {
    let seeds = await this._storage.get();
    const keypairs = seeds.map(seed => this.baseSdk.Keypair.fromSecret(seed));
    const filtered = keypairs.filter(keypair =>
      accountAddress.includes(keypair.publicKey())
    );
    this.baseSdk.Network.use(
      new this.baseSdk.Network(Environment.Testnet.passphrase)
    );
    if (filtered != null) {
      const tx = new this.baseSdk.Transaction(transactionEnvelpoe);
      const signers = [];
      signers.push(...filtered);
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
