import { useEffect, useState } from 'react';
import { useColorScheme, useWindowDimensions } from 'react-native';
import { useShallow } from 'zustand/react/shallow';
import { themeStoreSelectors, useThemeStore } from './store';
import type { ThemeMode } from './types';

export const useSyncSystemTheme = () => {
  const systemColorScheme = useColorScheme();
  const { fontScale } = useWindowDimensions();
  const { setSystemMode, setSystemFontScale } = useThemeStore(
    useShallow(state => ({
      setSystemMode: state.setSystemMode,
      setSystemFontScale: state.setSystemFontScale,
    })),
  );

  useEffect(() => {
    const systemMode: ThemeMode = systemColorScheme === 'dark' ? 'dark' : 'light';
    setSystemMode(systemMode);
  }, [setSystemMode, systemColorScheme]);

  useEffect(() => {
    setSystemFontScale(fontScale);
  }, [fontScale, setSystemFontScale]);
};

export const useThemeValue = () => useThemeStore(themeStoreSelectors.theme);

export const useThemePreferences = () =>
  useThemeStore(
    useShallow(state => ({
      preference: state.preference,
      fontScalePreference: state.fontScalePreference,
      setPreference: state.setPreference,
      setFontScalePreference: state.setFontScalePreference,
    })),
  );

export const useThemeHydrated = () => {
  const [hydrated, setHydrated] = useState(useThemeStore.persist.hasHydrated());

  useEffect(() => {
    const unsubscribeStart = useThemeStore.persist.onHydrate(() => {
      setHydrated(false);
    });
    const unsubscribeFinish = useThemeStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });

    setHydrated(useThemeStore.persist.hasHydrated());

    return () => {
      unsubscribeStart();
      unsubscribeFinish();
    };
  }, []);

  return hydrated;
};
