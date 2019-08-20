export declare class LocalStorageHandler {
    private readonly _key;
    private readonly _secret;
    private _storage;
    constructor(_key: string, _secret: string);
    private refresh;
    clear(): void;
    get(): string[];
    add(seed: string): void;
    private encrypt;
    private decrypt;
}
