import { Text, View } from 'react-native';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { useThemeValue } from '@/theme';
import type { ComponentSize, ComponentVariant } from './shared';
import { getVariantTokens, sizeScale } from './shared';

type BadgeProps = {
  label: string;
  variant?: ComponentVariant;
  size?: ComponentSize;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export const Badge = ({
  label,
  variant = 'secondary',
  size = 'md',
  style,
  textStyle,
}: BadgeProps) => {
  const theme = useThemeValue();
  const tokens = getVariantTokens(theme, variant);
  const scale = sizeScale[size];
  const containerStyle: ViewStyle = {
    alignSelf: 'flex-start',
    borderRadius: theme.radius.sm,
    borderWidth: variant === 'ghost' ? 0 : 1,
    borderColor: tokens.border,
    backgroundColor:
      variant === 'secondary'
        ? theme.colors.surfaceAlt
        : variant === 'ghost'
          ? 'transparent'
          : tokens.backgroundMuted,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: theme.spacing.xs / 3,
  };
  const labelStyle: TextStyle = {
    color:
      variant === 'secondary' || variant === 'ghost'
        ? theme.colors.textMuted
        : tokens.foreground,
    ...theme.typography.label,
    fontSize: theme.typography.label.fontSize * scale,
  };

  return (
    <View style={[containerStyle, style]}>
      <Text style={[labelStyle, textStyle]}>{label}</Text>
    </View>
  );
};
