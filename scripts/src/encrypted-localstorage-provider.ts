import * as KinSdk from "@kinecosystem/kin-sdk-js";
import { LocalStorageProvider } from "./EncryptedStorageProviders/LocalStorageProvider";

declare global {
    interface Window {
        EncryptedLocalStorageProvider: typeof EncryptedLocalStorageProvider;
    }
}
const SECRET_KEY = "my secret key";
const MOCK_USER_ID = "MOCK_USER_ID";

export class EncryptedLocalStorageProvider extends LocalStorageProvider implements KinSdk.KeystoreProvider {
    constructor(private readonly _sdk: typeof KinSdk, userId: string = MOCK_USER_ID) {
        super(_sdk.BaseKeyPair, userId);
    }

    get accounts(): Promise<[]> {
        return this.getAccounts() as Promise<[]>;
    }

    async sign(accountAddress: string, txEnvelope: string): Promise<string> {
        const keyStore = await this.get(accountAddress, SECRET_KEY);

        if (keyStore != null) {
            const tx = new this._sdk.XdrTransaction(txEnvelope);
            const signers = [];
            signers.push(this._sdk.BaseKeyPair.fromSecret(keyStore.seed));
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

window.EncryptedLocalStorageProvider = EncryptedLocalStorageProvider;
