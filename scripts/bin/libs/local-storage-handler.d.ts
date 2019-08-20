export declare class LocalStorageHandler {
    private readonly _key;
    private _storage;
    private readonly _secret;
    constructor(_key: string, secret: string);
    private refresh;
    clear(): void;
    get(): string[];
    private hash;
    add(seed: string): void;
    private encrypt;
    private decrypt;
}
