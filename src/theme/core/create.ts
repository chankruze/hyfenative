import { resolveFontScale } from '../font/scale';
import { buildTypography } from '../typography/build';
import { fontFamiliesByBrand } from '../font/families';
import { radius, spacing } from '../tokens/base';
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
  const typography = buildTypography(fontScale, fontFamiliesByBrand[brand][mode]);

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
  };
};
