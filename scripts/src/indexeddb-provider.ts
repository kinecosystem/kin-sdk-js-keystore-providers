import * as KinSdk from "@kinecosystem/kin-sdk-js";

declare global {
	interface Window {
		IndexedDbKeystoreProvider: typeof IndexedDbKeystoreProvider
	}
}

const KIN_WALLET_STORAGE_BUCKET = 'kin_wallet';

export class IndexedDbKeystoreProvider implements KinSdk.KeystoreProvider {
	private _sdk: typeof KinSdk;
	private _keypairs: KinSdk.KeyPair[];
	private _idb?: IDBDatabase;

	constructor(private readonly kinSdk: typeof KinSdk) {
		this._sdk = kinSdk;
		this._keypairs = new Array();
		let idb = window.indexedDB.open(KIN_WALLET_STORAGE_BUCKET, 1);
		idb.onerror = (ev) => {
			console.error('something is wrong ' + ev);
		};
		idb.onsuccess = (ev: any) => {
			this._idb = ev.target.result;
			this.getSeedsFromStorage();
		};
	}

	private async getSeedsFromStorage() {
		console.log('established connection');
		(this._idb as IDBDatabase).
		let seeds = JSON.parse(storageString || '[]');
		if (seeds.length == 0) {
			let keypair = this._sdk.KeyPair.generate()
			this._keypairs.push(keypair)
			this.updateSeedsStorage()
			console.log('Stored seed NOT found. Generated new seed:\n' + keypair.seed);
		} else {
			console.log(seeds);
			seeds.map((seed: string) => {
				console.log('Stored seed found and loaded: ' + seed);
				this.addKeyPair(seed)
			});
		}
	}

	private async updateSeedsStorage() {
		let seeds = this._keypairs.map(keypair => keypair.seed);
		window.localStorage.setItem(KIN_WALLET_STORAGE_INDEX, JSON.stringify(seeds))
	}

	public async addKeyPair(seed: string) {
		this._keypairs[this._keypairs.length] = this._sdk.KeyPair.fromSeed(seed);
		this.updateSeedsStorage();
	}

	get accounts(): Promise<string[]> {
		return Promise.resolve(this._keypairs.map(keypay => keypay.publicAddress));
	}

	public sign(accountAddress: string, transactionEnvelpoe: string): Promise<string> {
		const keypair = this._keypairs[0];
		if (keypair != null) {
			const tx = new this._sdk.XdrTransaction(transactionEnvelpoe);
			const signers = new Array();
			signers.push(this._sdk.BaseKeyPair.fromSecret(keypair.seed));
			tx.sign(...signers);
			return Promise.resolve(tx.toEnvelope().toXDR("base64").toString());
		} else { return Promise.reject("keypair null"); }
	}
}


window.IndexedDbKeystoreProvider = IndexedDbKeystoreProvider