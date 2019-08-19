export declare class LocalStorageHandler {
    private readonly _key;
    private _storage;
    constructor(_key: string);
    private refresh;
    getAll(): any;
    get(key: string): any;
    set(value: string): void;
}
