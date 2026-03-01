export type ThemeMode = 'light' | 'dark';

export type ThemePreference = ThemeMode | 'system';

export type ThemeBrand = 'default' | 'ocean';

export type ThemeFontScalePreference = 'system' | 'small' | 'medium' | 'large';

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

export type ThemeElevationLevel = {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
};

export type ThemeElevation = {
  sm: ThemeElevationLevel;
  md: ThemeElevationLevel;
  lg: ThemeElevationLevel;
};

export type ThemeSpacing = {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
};

export type ThemeMotion = {
  fast: number;
  normal: number;
  slow: number;
  press: number;
};

export type ThemeBackdrop = {
  subtle: string;
  strong: string;
};

export type ThemeState = {
  pressedOpacity: number;
  disabledOpacity: number;
};

export type ThemeFontFamilies = {
  regular: string;
  semibold: string;
  bold: string;
  extrabold: string;
};

export type ThemeTypographyVariant = {
  fontSize: number;
  fontWeight: '400' | '600' | '700' | '800';
  fontFamily: string;
  lineHeight?: number;
  letterSpacing?: number;
};

export type ThemeTypography = {
  kicker: ThemeTypographyVariant;
  h1: ThemeTypographyVariant;
  h2: ThemeTypographyVariant;
  body: ThemeTypographyVariant;
  bodySm: ThemeTypographyVariant;
  label: ThemeTypographyVariant;
  button: ThemeTypographyVariant;
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
  fontScale: number;
  fontScalePreference: ThemeFontScalePreference;
  colors: ThemeColors;
  spacing: ThemeSpacing;
  typography: ThemeTypography;
  radius: ThemeRadius;
  elevation: ThemeElevation;
  motion: ThemeMotion;
  backdrop: ThemeBackdrop;
  state: ThemeState;
};
