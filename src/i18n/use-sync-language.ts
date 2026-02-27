import { useEffect } from 'react';
import i18n from './index';
import { useLanguageStore } from '@/stores/use-language-store';

export const useSyncLanguage = () => {
  const language = useLanguageStore(state => state.language);

  useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language).catch(() => undefined);
    }
  }, [language]);
};
