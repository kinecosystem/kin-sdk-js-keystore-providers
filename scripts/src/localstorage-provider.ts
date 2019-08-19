import * as KinSdk from "@kinecosystem/kin-sdk-js";

declare global{
	interface Window {
		LocalStorageKeystoreProvider: typeof LocalStorageKeystoreProvider
	}
}

const KIN_WALLET_STORAGE_INDEX = 'kin_wallet';

// Before using this 
export class LocalStorageKeystoreProvider implements KinSdk.KeystoreProvider {
	private _keypairs: KinSdk.KeyPair[];

	constructor(private readonly _sdk: typeof KinSdk) {
		this._keypairs = new Array();
		this.getSeedsFromStorage();
	}

	private getSeedsFromStorage(){
		let storageString = window.localStorage.getItem(KIN_WALLET_STORAGE_INDEX);
		let seeds = JSON.parse(storageString || '[]');
		if (seeds.length == 0){
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

	private updateSeedsStorage(){
		let seeds = this._keypairs.map(keypair => keypair.seed);
		window.localStorage.setItem(KIN_WALLET_STORAGE_INDEX, JSON.stringify(seeds))
	}

	public addKeyPair(seed: string) {
		this._keypairs[this._keypairs.length] = this._sdk.KeyPair.fromSeed(seed);
		this.updateSeedsStorage();

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