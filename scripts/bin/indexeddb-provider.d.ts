import * as KinSdk from "@kinecosystem/kin-sdk-js";
declare global {
    interface Window {
        IndexedDbKeystoreProvider: typeof IndexedDbKeystoreProvider;
    }
}
export declare class IndexedDbKeystoreProvider implements KinSdk.KeystoreProvider {
    private readonly _sdk;
    private _keypairs;
    constructor(_sdk: typeof KinSdk);
    static readonly _idb: Promise<IDBDatabase>;
    static onUpgrade(ev: any): void;
    private setKeypairsFromStorage;
    private storeKeypairsToStorage;
    addKeyPair(seed: string): Promise<void>;
    readonly accounts: Promise<string[]>;
    sign(accountAddress: string, transactionEnvelpoe: string): Promise<string>;
}
