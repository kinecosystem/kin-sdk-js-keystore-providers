import * as KinSdk from "@kinecosystem/kin-sdk-js";

declare global {
  interface Window {
    SimpleKeystoreProvider: typeof SimpleKeystoreProvider;
  }
}

export class SimpleKeystoreProvider implements KinSdk.KeystoreProvider {
  private _keypairs: KinSdk.KeyPair[];

  constructor(private readonly _sdk: typeof KinSdk, _seed?: string) {
    this._keypairs = [];
    this._keypairs[0] = _seed !== undefined ? this._sdk.KeyPair.fromSeed(_seed) : this._sdk.KeyPair.generate();
  }

  public addKeyPair() {
    this._keypairs[this._keypairs.length] = this._sdk.KeyPair.generate();
  }

  get accounts() {
    return Promise.resolve(this._keypairs.map(keypair => keypair.publicAddress));
  }

  public sign(accountAddress: string, transactionEnvelpoe: string) {
    const keypair = this.getKeyPairFor(accountAddress);
    if (keypair != null) {
      const tx = new this._sdk.XdrTransaction(transactionEnvelpoe);
      const signers = [];
      signers.push(this._sdk.BaseKeyPair.fromSecret(keypair.seed));
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

  public getKeyPairFor(publicAddress: string) {
    return this._keypairs.find(keypair => keypair.publicAddress === publicAddress) || null;
  }
}

window.SimpleKeystoreProvider = SimpleKeystoreProvider;
