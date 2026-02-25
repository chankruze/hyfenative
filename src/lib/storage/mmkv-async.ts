import { storage } from './mmkv';

// Async adapter for MMKV (to use with createAsyncStoragePersister)
export const asyncStorage = {
  getItem: async (key: string) => {
    return storage.getString(key) ?? null;
  },
  setItem: async (key: string, value: string) => {
    storage.set(key, value);
  },
  removeItem: async (key: string) => {
    storage.remove(key);
  },
};
