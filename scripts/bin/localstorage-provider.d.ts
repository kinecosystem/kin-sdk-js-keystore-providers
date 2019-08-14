import * as KinSdk from "@kinecosystem/kin-sdk-js";
declare global {
    interface Window {
        BrowserStorageKeystoreProvider: typeof BrowserStorageKeystoreProvider;
    }
}
export declare class BrowserStorageKeystoreProvider implements KinSdk.KeystoreProvider {
    private readonly kinSdk;
    private _sdk;
    private _keypairs;
    constructor(kinSdk: typeof KinSdk);
    private setKeypairs;
    private updateKeyPairsStorage;
    addKeyPair(seed: string): void;
    readonly accounts: Promise<any[]>;
    sign(accountAddress: string, transactionEnvelpoe: string): Promise<any>;
}
