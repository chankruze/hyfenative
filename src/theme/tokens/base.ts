import type {
  ThemeBackdrop,
  ThemeElevation,
  ThemeMotion,
  ThemeRadius,
  ThemeState,
  ThemeSpacing,
} from '../types';

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

export const elevation: ThemeElevation = {
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.16,
    shadowRadius: 5,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
};

export const motion: ThemeMotion = {
  fast: 120,
  normal: 220,
  slow: 320,
  press: 90,
};

export const backdrop: ThemeBackdrop = {
  subtle: '#00000033',
  strong: '#00000066',
};

export const state: ThemeState = {
  pressedOpacity: 0.9,
  disabledOpacity: 0.55,
};
