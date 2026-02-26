export type ThemeMode = 'light' | 'dark';

export type ThemePreference = ThemeMode | 'system';

export type ThemeBrand = 'default' | 'ocean';

export type ThemeColors = {
  background: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  textMuted: string;
  textInverse: string;
  border: string;
  borderStrong: string;
  primary: string;
  primaryMuted: string;
  accent: string;
  error: string;
  success: string;
  inputBackground: string;
  inputPlaceholder: string;
  screenOverlay: string;
};

export type ThemeSpacing = {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
};

export type ThemeTypography = {
  kicker: {
    fontSize: number;
    letterSpacing: number;
    fontWeight: '700';
  };
  h1: {
    fontSize: number;
    lineHeight: number;
    fontWeight: '800';
  };
  h2: {
    fontSize: number;
    lineHeight: number;
    fontWeight: '800';
  };
  body: {
    fontSize: number;
    lineHeight: number;
    fontWeight: '400';
  };
  bodySm: {
    fontSize: number;
    lineHeight: number;
    fontWeight: '400';
  };
  label: {
    fontSize: number;
    lineHeight: number;
    fontWeight: '600';
  };
  button: {
    fontSize: number;
    lineHeight: number;
    fontWeight: '800';
  };
};

export type ThemeRadius = {
  sm: number;
  md: number;
  lg: number;
};

export type Theme = {
  id: string;
  mode: ThemeMode;
  brand: ThemeBrand;
  isDark: boolean;
  colors: ThemeColors;
  spacing: ThemeSpacing;
  typography: ThemeTypography;
  radius: ThemeRadius;
};
