import * as KinSdk from "@kinecosystem/kin-sdk-js-web";
declare global {
  interface Window {
    SimpleKeystoreProvider: typeof SimpleKeystoreProvider;
  }
}

export class SimpleKeystoreProvider implements KeystoreProvider {
  private _keypairs: Keypair[];

  constructor(private readonly _sdk: any) {
    this._keypairs = [];
    this.addKeyPair();
  }

  public addKeyPair() {
    this._keypairs.push(this._sdk.Keypair.random());
  }

  get publicAddresses() {
    return Promise.resolve(this._keypairs.map(keypair => keypair.publicKey()));
  }

  public sign(transactionEnvelpoe: string, ...accountAddress: string[]) {
    const keypairs = this._keypairs.filter(acc => accountAddress.includes(acc.publicKey()));
    this._sdk.Network.use(new this._sdk.Network(this._sdk.Environment.Testnet.passphrase));
    if (keypairs != null) {
      const tx = new this._sdk.Transaction(transactionEnvelpoe);
      const signers = [];
      signers.push(...keypairs);
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

window.SimpleKeystoreProvider = SimpleKeystoreProvider;
