import { BASE_TYPOGRAPHY } from './typography-base';
import type { ThemeFontFamilies, ThemeTypography } from './types';

const scaleValue = (value: number, scale: number) => Math.round(value * scale);

export const buildTypography = (
  scale: number,
  fontFamilies: ThemeFontFamilies,
): ThemeTypography => {
  const typographyEntries = Object.entries(BASE_TYPOGRAPHY).map(([key, value]) => {
    const scaledToken = {
      fontSize: scaleValue(value.fontSize, scale),
      fontWeight: value.fontWeight,
      fontFamily: fontFamilies[value.fontRole],
      ...(value.lineHeight === undefined
        ? {}
        : { lineHeight: scaleValue(value.lineHeight, scale) }),
      ...(value.letterSpacing === undefined
        ? {}
        : { letterSpacing: scaleValue(value.letterSpacing, scale) }),
    };

    return [key, scaledToken];
  });

  return Object.fromEntries(typographyEntries) as ThemeTypography;
};
