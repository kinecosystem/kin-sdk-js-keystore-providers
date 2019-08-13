import SimpleKeystoreProvider from './provider';

declare global{
	interface Window {
		SimpleKeystoreProvider: typeof SimpleKeystoreProvider
	}
}

window.SimpleKeystoreProvider = SimpleKeystoreProvider