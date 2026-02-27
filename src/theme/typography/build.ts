import { BASE_TYPOGRAPHY } from './base';
import type { ThemeFontFamilies, ThemeTypography } from '../types';

const scaleValue = (value: number, scale: number) => Math.round(value * scale);
const typographyCache = new Map<string, ThemeTypography>();

const getScaleCacheKey = (scale: number) => scale.toFixed(4);

const getFontFamiliesCacheKey = (fontFamilies: ThemeFontFamilies) =>
  [
    fontFamilies.regular,
    fontFamilies.semibold,
    fontFamilies.bold,
    fontFamilies.extrabold,
  ].join('|');

const getTypographyCacheKey = (scale: number, fontFamilies: ThemeFontFamilies) =>
  `${getScaleCacheKey(scale)}::${getFontFamiliesCacheKey(fontFamilies)}`;

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

export const getCachedTypography = (
  scale: number,
  fontFamilies: ThemeFontFamilies,
): ThemeTypography => {
  const cacheKey = getTypographyCacheKey(scale, fontFamilies);
  const cached = typographyCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const typography = buildTypography(scale, fontFamilies);
  typographyCache.set(cacheKey, typography);
  return typography;
};

export const precomputeTypographyScales = (
  fontFamilies: ThemeFontFamilies,
  scales: number[],
) => {
  scales.forEach(scale => {
    getCachedTypography(scale, fontFamilies);
  });
};
