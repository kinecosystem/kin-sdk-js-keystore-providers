import * as KinSdk from "@kinecosystem/kin-sdk-js";

declare global{
	interface Window {
		BrowserStorageKeystoreProvider: typeof BrowserStorageKeystoreProvider
	}
}

const KIN_WALLET_STORAGE_INDEX = 'kin_wallet';

export class BrowserStorageKeystoreProvider implements KinSdk.KeystoreProvider {
	private _sdk: typeof KinSdk;
	private _keypairs: KinSdk.KeyPair[];

	constructor(private readonly kinSdk: typeof KinSdk) {
		this._sdk = kinSdk;
		this._keypairs = new Array();
		this.setKeypairs();
	}

	private setKeypairs(){
		let storageString = window.localStorage.getItem(KIN_WALLET_STORAGE_INDEX);
		let seeds = JSON.parse(storageString || '[]');
		if (seeds.length == 0){
			let keypair = this._sdk.KeyPair.generate()
			this._keypairs.push(keypair)
			this.updateKeyPairsStorage()
			console.log('Stored seed NOT found. Generated new seed:\n' + keypair.seed);
		} else {
			for (let seed in seeds){
				console.log('Stored seed found and loaded:\n' + seed);
				this.addKeyPair(seed)
			}
		}
	}

	private updateKeyPairsStorage(){
		let seeds = this._keypairs.map(keypair => keypair.seed);
		window.localStorage.setItem(KIN_WALLET_STORAGE_INDEX, JSON.stringify(seeds))
	}

	public addKeyPair(seed: string) {
		this._keypairs[this._keypairs.length] = this._sdk.KeyPair.fromSeed(seed);

	}

	get accounts() {
		return Promise.resolve(this._keypairs.map(keypay => keypay.publicAddress));
	}

	public sign(accountAddress: string, transactionEnvelpoe: string) {
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


window.BrowserStorageKeystoreProvider = BrowserStorageKeystoreProvider