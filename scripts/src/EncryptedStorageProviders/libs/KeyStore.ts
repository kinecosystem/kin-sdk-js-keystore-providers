export enum KeyStoreType {
	ENCRYPTED,
	DECRYPTED
}

export interface IKeyStore {
	pkey: string;
	salt: string;
	seed: string;
	type: KeyStoreType;
}

export class KeyStore implements IKeyStore{
	pkey: string;
	salt: string;
	seed: string;
	type: KeyStoreType;

	constructor(pkey: string, salt: string, seed: string, type: KeyStoreType) {
		this.pkey = pkey;
		this.salt = salt;
		this.seed = seed;

		this.type = type
	}
}
