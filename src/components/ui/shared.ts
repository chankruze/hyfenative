import type { TextStyle, ViewStyle } from 'react-native';
import type { Theme } from '@/theme';

export type ComponentVariant = 'primary' | 'secondary' | 'destructive';

export type ComponentSize = 'sm' | 'md' | 'lg';

export const sizeScale: Record<ComponentSize, number> = {
  sm: 0.9,
  md: 1,
  lg: 1.15,
};

export const controlHeights: Record<ComponentSize, number> = {
  sm: 40,
  md: 48,
  lg: 56,
};

export const avatarSizes: Record<ComponentSize, number> = {
  sm: 28,
  md: 36,
  lg: 44,
};

export const iconSizes: Record<ComponentSize, number> = {
  sm: 14,
  md: 18,
  lg: 22,
};

export const assetSizes: Record<ComponentSize, number> = {
  sm: 18,
  md: 24,
  lg: 32,
};

export const spinnerSizes: Record<ComponentSize, number> = {
  sm: 16,
  md: 22,
  lg: 28,
};

type VariantTokens = {
  background: string;
  backgroundMuted: string;
  foreground: string;
  border: string;
};

const withAlpha = (hex: string, alphaHex: string) => {
  if (!hex.startsWith('#') || hex.length !== 7) {
    return hex;
  }

  return `${hex}${alphaHex}`;
};

export const getVariantTokens = (
  theme: Theme,
  variant: ComponentVariant,
): VariantTokens => {
  switch (variant) {
    case 'primary':
      return {
        background: theme.colors.primary,
        backgroundMuted: theme.colors.primaryMuted,
        foreground: theme.colors.textInverse,
        border: theme.colors.primary,
      };
    case 'destructive':
      return {
        background: theme.colors.error,
        backgroundMuted: withAlpha(theme.colors.error, '22'),
        foreground: theme.colors.textInverse,
        border: theme.colors.error,
      };
    case 'secondary':
    default:
      return {
        background: theme.colors.surfaceAlt,
        backgroundMuted: theme.colors.surfaceAlt,
        foreground: theme.colors.text,
        border: theme.colors.borderStrong,
      };
  }
};

export const getControlContainerStyle = (
  theme: Theme,
  variant: ComponentVariant,
  size: ComponentSize,
): ViewStyle => {
  const tokens = getVariantTokens(theme, variant);

  return {
    minHeight: controlHeights[size],
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: tokens.border,
    backgroundColor:
      variant === 'primary'
        ? theme.colors.inputBackground
        : tokens.backgroundMuted,
    paddingHorizontal: theme.spacing.sm,
  };
};

export const getControlTextStyle = (
  theme: Theme,
  variant: ComponentVariant,
): TextStyle => {
  const tokens = getVariantTokens(theme, variant);
  return {
    color: variant === 'secondary' ? theme.colors.text : tokens.foreground,
  };
};
