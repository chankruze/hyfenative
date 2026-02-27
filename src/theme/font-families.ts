import { Platform } from 'react-native';
import type { ThemeBrand, ThemeFontFamilies } from './types';

const systemSans = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  default: 'System',
});

const systemSansMedium = Platform.select({
  ios: 'System',
  android: 'sans-serif-medium',
  default: 'System',
});

const systemSansBold = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  default: 'System',
});

const systemSansBlack = Platform.select({
  ios: 'System',
  android: 'sans-serif-black',
  default: 'System',
});

const fallbackFont = 'System';

const sharedFontFamilies: ThemeFontFamilies = {
  regular: systemSans ?? fallbackFont,
  semibold: systemSansMedium ?? fallbackFont,
  bold: systemSansBold ?? fallbackFont,
  extrabold: systemSansBlack ?? fallbackFont,
};

export const fontFamiliesByBrand: Record<
  ThemeBrand,
  { light: ThemeFontFamilies; dark: ThemeFontFamilies }
> = {
  default: {
    light: sharedFontFamilies,
    dark: sharedFontFamilies,
  },
  ocean: {
    light: sharedFontFamilies,
    dark: sharedFontFamilies,
  },
};
