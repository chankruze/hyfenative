import type { ThemeTypography } from './types';

type BaseTypographyToken = {
  fontSize: number;
  fontWeight: ThemeTypography[keyof ThemeTypography]['fontWeight'];
  lineHeight?: number;
  letterSpacing?: number;
  fontRole: 'regular' | 'semibold' | 'bold' | 'extrabold';
};

export const BASE_TYPOGRAPHY: Record<keyof ThemeTypography, BaseTypographyToken> = {
  kicker: {
    fontSize: 12,
    letterSpacing: 1.2,
    fontWeight: '700',
    fontRole: 'bold',
  },
  h1: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '800',
    fontRole: 'extrabold',
  },
  h2: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '800',
    fontRole: 'extrabold',
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
    fontRole: 'regular',
  },
  bodySm: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    fontRole: 'regular',
  },
  label: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    fontRole: 'semibold',
  },
  button: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '800',
    fontRole: 'extrabold',
  },
};
