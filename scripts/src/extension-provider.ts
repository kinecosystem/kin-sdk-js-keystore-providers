import * as KinSdk from "@kinecosystem/kin-sdk-js";

declare global {
  interface Window {
    ExtensionKeystoreProvider: typeof ExtensionKeystoreProvider;
  }
}

const EXTENSION_ID = "ajibgglefmgckbegajkboddpjkokdkae";
const MY_SECRET = "my secret";
const COOKIE_MAX_LIFE = 3600 * 24; // 24h
const EXTENSION_URL = `https://chrome.google.com/webstore/detail/kin-sdk-extension/${EXTENSION_ID}`;

export interface ExtensionOptions {
  extension_auto_install: boolean;
  debug: boolean;
}

export class ExtensionKeystoreProvider implements KinSdk.KeystoreProvider {
  private ready = false;
  constructor(
    private readonly _sdk: typeof KinSdk,
    private readonly options: ExtensionOptions = {
      extension_auto_install: true,
      debug: process.env.NODE_ENV !== "production"
    }
  ) {
    if (chrome.runtime && chrome.runtime.sendMessage) {
      this.ready = true;
    } else {
      if (this.options.debug) console.warn("You are trying to use ExtensionKeystoreProvider but Kin Extension is missing.");
    }
  }

  get accounts(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      if (this.ready)
        chrome.runtime.sendMessage(EXTENSION_ID, { action: "ACCOUNTS", secret: MY_SECRET }, (results: string[] = []) => resolve(results));
    });
  }

  public sign(accountAddress: string, transactionEnvelpoe: string): Promise<string> {
    return new Promise(resolve => {
      chrome.runtime.sendMessage(
        EXTENSION_ID,
        { action: "SIGN", secret: MY_SECRET, data: { accountAddress, transactionEnvelpoe } },
        (signedTx: string) => {
          resolve(signedTx);
        }
      );
    });
  }

  public isInstalled(properties: { extension_auto_install: boolean }) {
    return new Promise((resolve, reject) => {
      try {
        chrome.runtime.sendMessage(EXTENSION_ID, { action: "IS_INSTALLED" }, reply => {
          if (reply) resolve(true);
        });
      } catch (err) {
        const cookie = `kin_ext_install_source='${window.location.hostname}';`;
        const maxAge = `max-age=${COOKIE_MAX_LIFE};`;
        const path = "path=/;";
        document.cookie = cookie.concat(maxAge, path);
        if (properties.extension_auto_install) window.open(EXTENSION_URL);
        reject(false);
      }
    });
  }
}

window.ExtensionKeystoreProvider = ExtensionKeystoreProvider;
