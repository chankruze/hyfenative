import MaterialDesignIcons, {
  type MaterialDesignIconsIconName,
} from '@react-native-vector-icons/material-design-icons';
import { useThemeValue } from '@/theme';
import type { ComponentSize, ComponentVariant } from './shared';
import { getVariantTokens, iconSizes } from './shared';

type IconByVariantProps = {
  name: MaterialDesignIconsIconName;
  variant?: ComponentVariant;
  size?: ComponentSize | number;
  color?: string;
};

export const IconByVariant = ({
  name,
  variant = 'primary',
  size = 'md',
  color,
}: IconByVariantProps) => {
  const theme = useThemeValue();
  const tokens = getVariantTokens(theme, variant);
  const iconSize = typeof size === 'number' ? size : iconSizes[size];
  const iconColor =
    color ??
    (variant === 'secondary' || variant === 'ghost'
      ? theme.colors.textMuted
      : tokens.background);

  return <MaterialDesignIcons name={name} size={iconSize} color={iconColor} />;
};
