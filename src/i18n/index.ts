import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { defaultLanguage, resources } from './resources';

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    resources,
    fallbackLng: defaultLanguage,
    lng: defaultLanguage,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  })
  .catch(() => undefined);

export default i18n;
