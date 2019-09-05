import * as KinSdk from "@kinecosystem/kin-sdk-js";

declare global {
  interface Window {
    ExtensionKeystoreProvider: typeof ExtensionKeystoreProvider;
  }
}

const EXTENSION_ID = "ajibgglefmgckbegajkboddpjkokdkae";
const EXTENSION_URL = `https://chrome.google.com/webstore/detail/kin-sdk-extension/${EXTENSION_ID}`;

export interface ExtensionProperties {
  extension_auto_install: boolean;
}

export class ExtensionKeystoreProvider implements KinSdk.KeystoreProvider {
  constructor(private readonly _sdk: typeof KinSdk) {}

  get accounts(): Promise<string[]> {
    console.log("extension-provider: get accounts");
    return new Promise(resolve => {
      chrome.runtime.sendMessage(EXTENSION_ID, { action: "accounts" }, (results: string[]) => {
        console.log("extension-provider: accounts = " + results);
        resolve(results);
      });
    });
  }

  public sign(accountAddress: string, transactionEnvelpoe: string): Promise<string> {
    return new Promise(resolve => {
      chrome.runtime.sendMessage(EXTENSION_ID, { action: "sign", data: { accountAddress, transactionEnvelpoe } }, (reply: string) => {
        resolve(reply);
      });
    });
  }

  public isInstalled() {
    return new Promise(resolve => {
      chrome.runtime.sendMessage(EXTENSION_ID, { action: "version" }, reply => {
        if (!reply) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }

  public async showSessionPopup() {
    chrome.runtime.sendMessage(EXTENSION_ID, { action: "tip" }, reply => {
      if (!reply) {
        console.log("somthing is not working");
      } else {
        console.log("got a replay");
      }
    });
  }
}

window.ExtensionKeystoreProvider = ExtensionKeystoreProvider;
