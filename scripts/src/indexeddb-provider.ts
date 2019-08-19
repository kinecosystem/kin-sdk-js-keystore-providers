import * as KinSdk from "@kinecosystem/kin-sdk-js";

declare global {
	interface Window {
		IndexedDbKeystoreProvider: typeof IndexedDbKeystoreProvider
	}
}

const KIN_WALLET_STORAGE = 'kin-wallets';
const KIN_WALLET_STORAGE_BUCKET = 'seeds';

export class IndexedDbKeystoreProvider implements KinSdk.KeystoreProvider {
	private _keypairs: KinSdk.KeyPair[];

	constructor(private readonly _sdk: typeof KinSdk) {
		this._keypairs = new Array();
	}

	static get _idb(): Promise<IDBDatabase>{
		return new Promise((resolve, reject) => {
			let idb = window.indexedDB.open(KIN_WALLET_STORAGE, 1);
			idb.onerror = (err) => {
				console.error('something is wrong ' + err);
				reject(err);
			};
			idb.onsuccess = (ev: any) => {
				console.log('established connection');
				resolve(ev.target.result);
			};
			idb.onupgradeneeded = this.onUpgrade
		})
	}

	static onUpgrade(ev: any){
		console.log('onUpgrade fired');
		let db: IDBDatabase = ev.target.result;
		db.createObjectStore(KIN_WALLET_STORAGE_BUCKET, { keyPath: "seed" });
	}

	private loadKeypairsFromStorage() {
		return new Promise(async done => {
			let db = await IndexedDbKeystoreProvider._idb
			let objectStore = db.transaction(KIN_WALLET_STORAGE_BUCKET).objectStore(KIN_WALLET_STORAGE_BUCKET)
			objectStore.getAll().onsuccess = (ev: any) => {
				this._keypairs = new Array();
				let results = ev.target.result;
				if (results.length == 0) {
					console.log('Seed not found');
				} else {
					results.map((result: any) => {
						console.log('found stored seed. loading: ' + result.seed);
						this._keypairs[this._keypairs.length] = this._sdk.KeyPair.fromSeed(result.seed)
					});
				}
			}
			objectStore.transaction.oncomplete = () => {
				console.log('connection closed');
				db.close();
				done();
			}
			objectStore.transaction.onerror = (err) => {
				console.log('transaction error ' + err);
				db.close();
			}
		})
	}

	private storeKeypairToStorage(keypair: KinSdk.KeyPair){
		return new Promise(async resolve => {
			let db = await IndexedDbKeystoreProvider._idb
			let objectStore = db.transaction(KIN_WALLET_STORAGE_BUCKET, "readwrite").objectStore(KIN_WALLET_STORAGE_BUCKET)
			objectStore.add({seed: keypair.seed});
			objectStore.transaction.oncomplete = () => {
				console.log('connection closed');
				db.close();
				resolve();
			}
		})
	}

	public async addKeyPair(seed?: string) {
		let newKeyPair = seed === undefined ? this._sdk.KeyPair.generate() : this._sdk.KeyPair.fromSeed(seed);
		this._keypairs[this._keypairs.length] = newKeyPair;
		await this.storeKeypairToStorage(newKeyPair)
	}

	get accounts(): Promise<string[]> {
		return new Promise(async resolve => {
			console.log('loading keys into memory');
			await this.loadKeypairsFromStorage();
			resolve(this._keypairs.map(keypair => keypair.publicAddress));
		});
	}

	public sign(accountAddress: string, transactionEnvelpoe: string): Promise<string> {
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


window.IndexedDbKeystoreProvider = IndexedDbKeystoreProvider