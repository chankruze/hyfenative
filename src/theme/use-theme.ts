import { useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { createTheme } from './create-theme';
import { selectThemeBrand, selectThemePreference, useThemeStore } from './theme-store';
import type { ThemeMode } from './types';

export const useTheme = () => {
  const systemColorScheme = useColorScheme();
  const preference = useThemeStore(selectThemePreference);
  const brand = useThemeStore(selectThemeBrand);
  const setPreference = useThemeStore(state => state.setPreference);
  const setBrand = useThemeStore(state => state.setBrand);

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
