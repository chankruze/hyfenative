import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '@/lib/storage/keys';
import { zustandMMKVStorage } from '@/lib/storage';
import type { ThemeBrand, ThemePreference } from './types';

type ThemeStoreState = {
  preference: ThemePreference;
  brand: ThemeBrand;
  setPreference: (preference: ThemePreference) => void;
  setBrand: (brand: ThemeBrand) => void;
};

const defaultThemeState: Pick<ThemeStoreState, 'preference' | 'brand'> = {
  preference: 'system',
  brand: 'default',
};

export const useThemeStore = create<ThemeStoreState>()(
  persist(
    set => ({
      ...defaultThemeState,
      setPreference: preference => set({ preference }),
      setBrand: brand => set({ brand }),
    }),
    {
      name: STORAGE_KEYS.THEME_STORE,
      version: 1,
      partialize: state => ({
        preference: state.preference,
        brand: state.brand,
      }),
      storage: createJSONStorage(() => zustandMMKVStorage),
    },
  ),
);

export const selectThemePreference = (state: ThemeStoreState) =>
  state.preference;

export const selectThemeBrand = (state: ThemeStoreState) => state.brand;

export const resetThemeStore = () => useThemeStore.setState(defaultThemeState);
