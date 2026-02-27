import { useEffect, useState } from 'react';
import { getLocales } from 'react-native-localize';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '@/lib/storage/keys';
import { zustandMMKVStorage } from '@/lib/storage';
import { registerStoreResetter } from './store-reset-registry';
import { defaultLanguage, type AppLanguage } from '@/i18n/resources';

const isAppLanguage = (value: string): value is AppLanguage =>
  value === 'en' || value === 'hi';

const getDeviceLanguage = (): AppLanguage => {
  const deviceLanguage = getLocales()[0]?.languageCode;
  if (deviceLanguage && isAppLanguage(deviceLanguage)) {
    return deviceLanguage;
  }

  return defaultLanguage;
};

type LanguageStoreState = {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
};

const defaultState: Pick<LanguageStoreState, 'language'> = {
  language: getDeviceLanguage(),
};

export const useLanguageStore = create<LanguageStoreState>()(
  persist(
    set => ({
      ...defaultState,
      setLanguage: language => set({ language }),
    }),
    {
      name: STORAGE_KEYS.LANGUAGE_STORE,
      version: 1,
      partialize: state => ({
        language: state.language,
      }),
      storage: createJSONStorage(() => zustandMMKVStorage),
    },
  ),
);

export const languageStoreSelectors = {
  language: (state: LanguageStoreState) => state.language,
  setLanguage: (state: LanguageStoreState) => state.setLanguage,
} as const;

export const useLanguageHydrated = () => {
  const [hydrated, setHydrated] = useState(useLanguageStore.persist.hasHydrated());

  useEffect(() => {
    const unsubscribeStart = useLanguageStore.persist.onHydrate(() => {
      setHydrated(false);
    });
    const unsubscribeFinish = useLanguageStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });

    setHydrated(useLanguageStore.persist.hasHydrated());

    return () => {
      unsubscribeStart();
      unsubscribeFinish();
    };
  }, []);

  return hydrated;
};

export const resetLanguageStore = () => useLanguageStore.setState(defaultState);

registerStoreResetter(resetLanguageStore);
