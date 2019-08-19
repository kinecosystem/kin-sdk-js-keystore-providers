import * as KinSdk from "@kinecosystem/kin-sdk-js";
import { LocalStorageHandler } from "./libs/local-storage-handler";

declare global{
	interface Window {
		LocalStorageKeystoreProvider: typeof LocalStorageKeystoreProvider
	}
}

const KIN_WALLET_STORAGE_INDEX = 'kin-wallet';
const SECRET_KEY = 'my secret key';

export class LocalStorageKeystoreProvider implements KinSdk.KeystoreProvider {
	private _keypairs: KinSdk.KeyPair[];
	private _storage: LocalStorageHandler;
	
	constructor(private readonly _sdk: typeof KinSdk) {
		this._keypairs = new Array();
		this._storage = new LocalStorageHandler(KIN_WALLET_STORAGE_INDEX, SECRET_KEY);
	}

	public async addKeyPair(seed: string) {
		this._keypairs[this._keypairs.length] = this._sdk.KeyPair.fromSeed(seed);
		let seeds = this._keypairs.map(keypair => keypair.seed);
		this._storage.set(seeds);
	}

	get accounts() {
		return Promise.resolve(this._keypairs.map(keypay => keypay.publicAddress));
	}

	public sign(accountAddress: string, transactionEnvelpoe: string) {
		const keypair = this._keypairs.find(acc => acc.publicAddress == accountAddress);
		if (keypair != null) {
			const tx = new this._sdk.XdrTransaction(transactionEnvelpoe);
			const signers = new Array();
			signers.push(this._sdk.BaseKeyPair.fromSecret(keypair.seed));
			tx.sign(...signers);
			return Promise.resolve(tx.toEnvelope().toXDR("base64").toString());
		} else { return Promise.reject("keypair null"); }
	}
}

window.LocalStorageKeystoreProvider = LocalStorageKeystoreProvider