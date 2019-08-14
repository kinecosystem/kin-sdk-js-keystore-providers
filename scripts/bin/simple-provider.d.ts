import * as KinSdk from "@kinecosystem/kin-sdk-js";
declare global {
    interface Window {
        SimpleKeystoreProvider: typeof SimpleKeystoreProvider;
    }
}
export declare class SimpleKeystoreProvider implements KinSdk.KeystoreProvider {
    private readonly kinSdk;
    private readonly _seed?;
    private _sdk;
    private _keypairs;
    constructor(kinSdk: typeof KinSdk, _seed?: string | undefined);
    addKeyPair(): void;
    readonly accounts: Promise<any[]>;
    sign(accountAddress: string, transactionEnvelpoe: string): Promise<any>;
    getKeyPairFor(publicAddress: string): KinSdk.KeyPair | null;
}
