import { resolveFontScale } from '../font/scale';
import {
  getCachedTypography,
  precomputeTypographyScales,
} from '../typography/build';
import { fontFamiliesByBrand } from '../font/families';
import { backdrop, elevation, motion, radius, spacing, state } from '../tokens/base';
import { darkColors } from '../tokens/dark';
import { lightColors } from '../tokens/light';
import { oceanDarkColors, oceanLightColors } from '../tokens/ocean';
import type {
  Theme,
  ThemeBrand,
  ThemeFontScalePreference,
  ThemeMode,
} from '../types';

const colorPaletteByBrand: Record<
  ThemeBrand,
  { light: typeof lightColors; dark: typeof darkColors }
> = {
  default: {
    light: lightColors,
    dark: darkColors,
  },
  ocean: {
    light: oceanLightColors,
    dark: oceanDarkColors,
  },
};

const PRECOMPUTED_APP_SCALES = [
  resolveFontScale('small', 1),
  resolveFontScale('medium', 1),
  resolveFontScale('large', 1),
];

Object.values(fontFamiliesByBrand).forEach(brandFonts => {
  precomputeTypographyScales(brandFonts.light, PRECOMPUTED_APP_SCALES);
  precomputeTypographyScales(brandFonts.dark, PRECOMPUTED_APP_SCALES);
});

export const createTheme = ({
  mode,
  brand,
  fontScalePreference,
  systemFontScale,
}: {
  mode: ThemeMode;
  brand: ThemeBrand;
  fontScalePreference: ThemeFontScalePreference;
  systemFontScale: number;
}): Theme => {
  const colors = colorPaletteByBrand[brand][mode];
  const fontScale = resolveFontScale(fontScalePreference, systemFontScale);
  const typography = getCachedTypography(
    fontScale,
    fontFamiliesByBrand[brand][mode],
  );

  return {
    id: `${brand}-${mode}`,
    mode,
    brand,
    isDark: mode === 'dark',
    fontScale,
    fontScalePreference,
    colors,
    spacing,
    typography,
    radius,
    elevation,
    motion,
    backdrop,
    state,
  };
};
