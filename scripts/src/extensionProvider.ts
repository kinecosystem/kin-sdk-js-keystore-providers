import * as KinSdk from "@kinecosystem/kin-sdk-js-web";

declare global {
  interface Window {
    ExtensionKeystoreProvider: typeof ExtensionKeystoreProvider;
  }
}

const EXTENSION_ID = "eckcfmndhmmoncgpkkolkpogbcoeaohg";
const COOKIE_MAX_LIFE = 3600 * 24; // 24h
const EXTENSION_URL = `https://chrome.google.com/webstore/detail/kin-wallet-chrome-extensi/${EXTENSION_ID}`;

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
    console.log("accounts()");
    return new Promise(resolve => {
      if (this.ready) chrome.runtime.sendMessage(EXTENSION_ID, { action: "ACCOUNTS" }, (results: string[] = []) => resolve(results));
    });
  }

  public async sign(accountAddress: string, transactionEnvelpoe: string): Promise<string> {
    console.log("extension provider: sign");
    return new Promise(resolve => {
      chrome.runtime.sendMessage(EXTENSION_ID, { action: "ACTIVE_SESSINO" }, respons => {
        console.log(respons);
        if (respons !== undefined) {
          chrome.runtime.sendMessage(EXTENSION_ID, { action: "SIGN", data: { accountAddress, transactionEnvelpoe } }, (signedTx: string) => {
            console.log(signedTx);
            console.log("extension provider: sign -> respons: " + signedTx);
            if (signedTx) resolve(signedTx);
            else throw "Sign Error";
          });
        } else {
          throw "SESSION ERROR";
        }
      });
    });
  }

  public isInstalled(properties: { extension_auto_install: boolean }) {
    return new Promise((resolve, reject) => {
      try {
        chrome.runtime.sendMessage(EXTENSION_ID, { action: "IS_INSTALLED" }, reply => {
          if (reply) resolve(true);
          console.log("installed");
        });
      } catch (err) {
        console.log("not installed");
        const cookie = `kin_ext_install_source=${window.location.href};`;
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
