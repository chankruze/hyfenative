import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '@/lib/storage/keys';
import { zustandMMKVStorage } from '@/lib/storage';
import { registerStoreResetter } from '@/stores/store-reset-registry';
import { createTheme } from './core/create';
import type {
  Theme,
  ThemeBrand,
  ThemeFontScalePreference,
  ThemeMode,
  ThemePreference,
} from './types';

type ThemeStoreState = {
  preference: ThemePreference;
  brand: ThemeBrand;
  fontScalePreference: ThemeFontScalePreference;
  systemMode: ThemeMode;
  systemFontScale: number;
  setPreference: (preference: ThemePreference) => void;
  setBrand: (brand: ThemeBrand) => void;
  setFontScalePreference: (fontScalePreference: ThemeFontScalePreference) => void;
  setSystemMode: (systemMode: ThemeMode) => void;
  setSystemFontScale: (systemFontScale: number) => void;
};

const defaultThemeState: Pick<
  ThemeStoreState,
  'preference' | 'brand' | 'fontScalePreference'
> = {
  preference: 'system',
  brand: 'default',
  fontScalePreference: 'system',
};

const defaultSystemState: Pick<ThemeStoreState, 'systemMode' | 'systemFontScale'> =
  {
    systemMode: 'light',
    systemFontScale: 1,
  };

export const useThemeStore = create<ThemeStoreState>()(
  persist(
    set => ({
      ...defaultThemeState,
      ...defaultSystemState,
      setPreference: preference => set({ preference }),
      setBrand: brand => set({ brand }),
      setFontScalePreference: fontScalePreference => set({ fontScalePreference }),
      setSystemMode: systemMode => set({ systemMode }),
      setSystemFontScale: systemFontScale => set({ systemFontScale }),
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
            ...(persistedState as Omit<
              ThemeStoreState,
              | 'setPreference'
              | 'setBrand'
              | 'setFontScalePreference'
              | 'setSystemMode'
              | 'setSystemFontScale'
            >),
            fontScalePreference: 'system' as const,
          };
        }

        return persistedState as Omit<
          ThemeStoreState,
          | 'setPreference'
          | 'setBrand'
          | 'setFontScalePreference'
          | 'setSystemMode'
          | 'setSystemFontScale'
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

const resolveMode = (state: ThemeStoreState): ThemeMode =>
  state.preference === 'system' ? state.systemMode : state.preference;

let lastThemeCacheKey = '';
let lastTheme: Theme | null = null;

const selectTheme = (state: ThemeStoreState): Theme => {
  const mode = resolveMode(state);
  const cacheKey = `${state.brand}:${mode}:${state.fontScalePreference}:${state.systemFontScale}`;

  if (cacheKey === lastThemeCacheKey && lastTheme) {
    return lastTheme;
  }

  lastThemeCacheKey = cacheKey;
  lastTheme = createTheme({
    mode,
    brand: state.brand,
    fontScalePreference: state.fontScalePreference,
    systemFontScale: state.systemFontScale,
  });

  return lastTheme;
};

export const themeStoreSelectors = {
  theme: selectTheme,
  preference: (state: ThemeStoreState) => state.preference,
  brand: (state: ThemeStoreState) => state.brand,
  fontScalePreference: (state: ThemeStoreState) => state.fontScalePreference,
  resolvedMode: resolveMode,
  setPreference: (state: ThemeStoreState) => state.setPreference,
  setBrand: (state: ThemeStoreState) => state.setBrand,
  setFontScalePreference: (state: ThemeStoreState) =>
    state.setFontScalePreference,
  setSystemMode: (state: ThemeStoreState) => state.setSystemMode,
  setSystemFontScale: (state: ThemeStoreState) => state.setSystemFontScale,
} as const;

export const resetThemeStore = () =>
  useThemeStore.setState({ ...defaultThemeState, ...defaultSystemState });

registerStoreResetter(resetThemeStore);
