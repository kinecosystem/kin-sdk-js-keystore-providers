import { EncryptedStorageProvider } from "./EncryptedStorageProvider";
import { IKeyStore } from "../libs/KeyStore";
import { getIndex } from "../libs/utils";
import { BaseKeyPair } from "@kinecosystem/kin-sdk-js";

export class LocalStorageProvider extends EncryptedStorageProvider {
  public userId: string;

  constructor(baseKeyPair: typeof BaseKeyPair, userId: string) {
    super(baseKeyPair);
    this.userId = userId;
  }

  protected addHandler(keyStore: IKeyStore): Promise<boolean> {
    return new Promise(async resolve => {
      localStorage.setItem(getIndex(this.userId), JSON.stringify(keyStore));
      resolve(true);
    });
  }

  protected getHandler(): Promise<IKeyStore> {
    console.log("getHandler");
    return new Promise(async resolve => {
      const keyStore = localStorage.getItem(getIndex(this.userId)) || "";
      resolve(JSON.parse(keyStore));
    });
  }

  protected removeHandler(): Promise<boolean> {
    return new Promise(async resolve => {
      localStorage.removeItem(getIndex(this.userId));
      resolve(true);
    });
  }
}
