const KIN_WALLET_STORAGE_INDEX = "kin-wallet";
export const getIndex = (id?: string) => `${KIN_WALLET_STORAGE_INDEX}${id && `_${id}`}`;
