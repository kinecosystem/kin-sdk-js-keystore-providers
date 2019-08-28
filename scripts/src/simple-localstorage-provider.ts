import * as KinSdk from "@kinecosystem/kin-sdk-js";

declare global {
    interface Window {
        SimpleLocalStorageKeystoreProvider: typeof SimpleLocalStorageKeystoreProvider;
    }
}

const KIN_WALLET_STORAGE_INDEX = "kin-wallet";

export class SimpleLocalStorageKeystoreProvider implements KinSdk.KeystoreProvider {
    private _storage: Array<string>;

    constructor(private readonly _sdk: typeof KinSdk) {
        this._storage = [];
        this.get();
    }

    private add(seed: string) {
        this._storage.push(seed);
        window.localStorage.setItem(KIN_WALLET_STORAGE_INDEX, JSON.stringify(this._storage));
    }

    private get() {
        let storageString = window.localStorage.getItem(KIN_WALLET_STORAGE_INDEX);
        this._storage = JSON.parse(storageString || "[]");
        return this._storage;
    }

    public addKeyPair(seed: string) {
        if (seed == undefined) this.add(this._sdk.KeyPair.generate().seed);
        else this.add(seed);
    }

    get accounts() {
        let accounts = this.get().map(seed => this._sdk.KeyPair.fromSeed(seed).publicAddress);
        return Promise.resolve(accounts);
    }

    public async sign(accountAddress: string, transactionEnvelpoe: string) {
        const seed = this._storage.find(seed => {
            let tmpAcc = this._sdk.KeyPair.fromSeed(seed);
            return accountAddress == tmpAcc.publicAddress;
        });

        if (seed != null) {
            const tx = new this._sdk.XdrTransaction(transactionEnvelpoe);
            const signers = [];
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
