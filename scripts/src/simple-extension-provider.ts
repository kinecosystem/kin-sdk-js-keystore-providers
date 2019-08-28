import * as KinSdk from "@kinecosystem/kin-sdk-js";
import { SimpleLocalStorageKeystoreProvider } from ".";

declare global {
    interface Window {
        SimpleExtensionKeystoreProvider: typeof SimpleExtensionKeystoreProvider;
    }
}

const EXTENSION_ID = "ajibgglefmgckbegajkboddpjkokdkae";
const EXTENSION_URL = `https://chrome.google.com/webstore/detail/kin-sdk-extension/${EXTENSION_ID}`;
const COOKIE_MAX_LIFE = 3600; // 1h

export interface ExtensionProperties {
    extension_auto_install: boolean;
}

export class SimpleExtensionKeystoreProvider {
    private readonly _sdk: typeof KinSdk;
    private readonly _properties: ExtensionProperties;
    constructor(
        _sdk: typeof KinSdk,
        _properties: ExtensionProperties = {
            extension_auto_install: true
        }
    ) {
        this._sdk = _sdk;
        this._properties = _properties;
    }

    public isInstalled() {
        return new Promise(resolve => {
            chrome.runtime.sendMessage(EXTENSION_ID, { message: "version" }, reply => {
                if (!reply) {
                    const cookie = `kin_ext_install_source='${window.location.hostname}';`;
                    const maxAge = `max-age=${COOKIE_MAX_LIFE};`;
                    const path = "path=/;";
                    document.cookie = cookie.concat(maxAge, path);
                    if (this._properties.extension_auto_install) {
                        window.open(EXTENSION_URL);
                    }
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
        });
    }

    public showSessionPopup() {}
}

window.SimpleExtensionKeystoreProvider = SimpleExtensionKeystoreProvider;
