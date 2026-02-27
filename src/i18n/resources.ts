import en from './translations/en';
import hi from './translations/hi';

export const defaultLanguage = 'en' as const;
export const defaultNS = 'translation' as const;

export const resources = {
  en: { translation: en },
  hi: { translation: hi },
} as const;

export type AppLanguage = keyof typeof resources;

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    resources: (typeof resources)['en'];
  }
}
