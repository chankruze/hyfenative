import { radius, spacing, typography } from './tokens/base';
import { darkColors } from './tokens/dark';
import { lightColors } from './tokens/light';
import { oceanDarkColors, oceanLightColors } from './tokens/ocean';
import type { Theme, ThemeBrand, ThemeMode } from './types';

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
}: {
  mode: ThemeMode;
  brand: ThemeBrand;
}): Theme => {
  const colors = colorPaletteByBrand[brand][mode];

  return {
    id: `${brand}-${mode}`,
    mode,
    brand,
    isDark: mode === 'dark',
    colors,
    spacing,
    typography,
    radius,
  };
};
