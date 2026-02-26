import type { ThemeRadius, ThemeSpacing, ThemeTypography } from '../types';

export const spacing: ThemeSpacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
};

export const radius: ThemeRadius = {
  sm: 10,
  md: 12,
  lg: 16,
};

export const typography: ThemeTypography = {
  kicker: {
    fontSize: 12,
    letterSpacing: 1.2,
    fontWeight: '700',
  },
  h1: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '800',
  },
  h2: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '800',
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  },
  bodySm: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  },
  label: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
  },
  button: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '800',
  },
};
