import { useEffect, useMemo, useState } from 'react';
import { useColorScheme, useWindowDimensions } from 'react-native';
import { createTheme } from './core/create';
import { themeStoreSelectors, useThemeStore } from './store';
import type { ThemeMode } from './types';

export const useTheme = () => {
  const systemColorScheme = useColorScheme();
  const preference = useThemeStore(themeStoreSelectors.preference);
  const brand = useThemeStore(themeStoreSelectors.brand);
  const fontScalePreference = useThemeStore(
    themeStoreSelectors.fontScalePreference,
  );
  const setPreference = useThemeStore(themeStoreSelectors.setPreference);
  const setBrand = useThemeStore(themeStoreSelectors.setBrand);
  const setFontScalePreference = useThemeStore(
    themeStoreSelectors.setFontScalePreference,
  );
  const { fontScale: systemFontScale } = useWindowDimensions();

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
        fontScalePreference,
        systemFontScale,
      }),
    [brand, fontScalePreference, resolvedMode, systemFontScale],
  );

  return {
    theme,
    preference,
    resolvedMode,
    brand,
    fontScalePreference,
    setPreference,
    setBrand,
    setFontScalePreference,
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
