export declare class LocalStorageHandler {
    private readonly _key;
    private readonly _secret;
    private _storage;
    constructor(_key: string, _secret: string);
    private refresh;
    clear(): void;
    get(): Promise<any>;
    set(value: Array<string>): Promise<void>;
    private encrypt;
    private decrypt;
}
