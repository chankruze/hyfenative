import type { StateStorage } from 'zustand/middleware';
import { storage } from './mmkv';

export const zustandMMKVStorage: StateStorage = {
  getItem: (key: string) => {
    return storage.getString(key) ?? null;
  },
  setItem: (key: string, value: string) => {
    storage.set(key, value);
  },
  removeItem: (key: string) => {
    storage.remove(key);
  },
};
