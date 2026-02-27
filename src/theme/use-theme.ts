import { useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { createTheme } from './create-theme';
import { themeStoreSelectors, useThemeStore } from './store';
import type { ThemeMode } from './types';

export const useTheme = () => {
  const systemColorScheme = useColorScheme();
  const preference = useThemeStore(themeStoreSelectors.preference);
  const brand = useThemeStore(themeStoreSelectors.brand);
  const setPreference = useThemeStore(themeStoreSelectors.setPreference);
  const setBrand = useThemeStore(themeStoreSelectors.setBrand);

  const resolvedMode: ThemeMode =
    preference === 'system'
      ? systemColorScheme === 'dark'
        ? 'dark'
        : 'light'
      : preference;

  const theme = useMemo(
    () =>
      createTheme({
        mode: resolvedMode,
        brand,
      }),
    [brand, resolvedMode],
  );

  return {
    theme,
    preference,
    resolvedMode,
    brand,
    setPreference,
    setBrand,
  };
};

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
