import { EncryptedStorageProvider } from "./EncryptedStorageProvider";
import { IKeyStore } from "../libs/KeyStore";
import { BaseKeyPair } from "@kinecosystem/kin-sdk-js";

export class RemoteStorageProvider extends EncryptedStorageProvider {
    public userId: string;
    public baseEndpoint: string;

    constructor(baseKeyPair: typeof BaseKeyPair, userId: string, baseEndpoint: string) {
        super(baseKeyPair);
        this.userId = userId;
        this.baseEndpoint = baseEndpoint;
    }

    protected async addHandler(keyStore: IKeyStore): Promise<boolean> {
        const response = await fetch(`${this.baseEndpoint}/user/wallet/${this.userId}`, {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer SOME_TOKEN"
            },
            body: JSON.stringify(keyStore)
        });

        return true;
    }

    protected async getHandler(publicAddress: string): Promise<IKeyStore> {
        const response = await fetch(`${this.baseEndpoint}/user/wallet/${this.userId}/${publicAddress}`, {
            method: "GET",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer SOME_TOKEN"
            }
        });

        return JSON.parse(await response.text());
    }

    protected async removeHandler(keyStore: IKeyStore): Promise<boolean> {
        const response = await fetch(`${this.baseEndpoint}/user/wallet/${this.userId}/${keyStore.pkey}`, {
            method: "DELETE",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer SOME_TOKEN"
            }
        });

        return true;
    }
}
