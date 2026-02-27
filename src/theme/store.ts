import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '@/lib/storage/keys';
import { zustandMMKVStorage } from '@/lib/storage';
import { registerStoreResetter } from '@/stores/store-reset-registry';
import type {
  ThemeBrand,
  ThemeFontScalePreference,
  ThemePreference,
} from './types';

type ThemeStoreState = {
  preference: ThemePreference;
  brand: ThemeBrand;
  fontScalePreference: ThemeFontScalePreference;
  setPreference: (preference: ThemePreference) => void;
  setBrand: (brand: ThemeBrand) => void;
  setFontScalePreference: (fontScalePreference: ThemeFontScalePreference) => void;
};

const defaultThemeState: Pick<
  ThemeStoreState,
  'preference' | 'brand' | 'fontScalePreference'
> = {
  preference: 'system',
  brand: 'default',
  fontScalePreference: 'system',
};

export const useThemeStore = create<ThemeStoreState>()(
  persist(
    set => ({
      ...defaultThemeState,
      setPreference: preference => set({ preference }),
      setBrand: brand => set({ brand }),
      setFontScalePreference: fontScalePreference => set({ fontScalePreference }),
    }),
    {
      name: STORAGE_KEYS.THEME_STORE,
      version: 2,
      migrate: (persistedState, version) => {
        if (!persistedState || typeof persistedState !== 'object') {
          return defaultThemeState;
        }

        if (version < 2) {
          return {
            ...(persistedState as Omit<ThemeStoreState, 'setPreference' | 'setBrand' | 'setFontScalePreference'>),
            fontScalePreference: 'system' as const,
          };
        }

        return persistedState as Omit<
          ThemeStoreState,
          'setPreference' | 'setBrand' | 'setFontScalePreference'
        >;
      },
      partialize: state => ({
        preference: state.preference,
        brand: state.brand,
        fontScalePreference: state.fontScalePreference,
      }),
      storage: createJSONStorage(() => zustandMMKVStorage),
    },
  ),
);

export const themeStoreSelectors = {
  preference: (state: ThemeStoreState) => state.preference,
  brand: (state: ThemeStoreState) => state.brand,
  fontScalePreference: (state: ThemeStoreState) => state.fontScalePreference,
  setPreference: (state: ThemeStoreState) => state.setPreference,
  setBrand: (state: ThemeStoreState) => state.setBrand,
  setFontScalePreference: (state: ThemeStoreState) =>
    state.setFontScalePreference,
} as const;

export const resetThemeStore = () => useThemeStore.setState(defaultThemeState);

registerStoreResetter(resetThemeStore);
