import { Text, View } from 'react-native';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { useThemeValue } from '@/theme';
import type { ComponentSize, ComponentVariant } from '../primitives/shared';
import { getVariantTokens, sizeScale } from '../primitives/shared';

type BadgeProps = {
  label: string;
  variant?: ComponentVariant;
  size?: ComponentSize;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export const Badge = ({
  label,
  variant = 'primary',
  size = 'md',
  style,
  textStyle,
}: BadgeProps) => {
  const theme = useThemeValue();
  const resolvedVariant: ComponentVariant = variant || 'primary';
  const tokens = getVariantTokens(theme, resolvedVariant);
  const scale = sizeScale[size];
  const containerStyle: ViewStyle = {
    alignSelf: 'flex-start',
    borderRadius: theme.radius.sm,
    borderWidth: resolvedVariant === 'ghost' ? 0 : 1,
    borderColor: tokens.border,
    backgroundColor:
      resolvedVariant === 'secondary'
        ? theme.colors.surfaceAlt
        : resolvedVariant === 'ghost'
          ? 'transparent'
          : tokens.backgroundMuted,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: theme.spacing.xs / 3,
  };
  const labelStyle: TextStyle = {
    color:
      resolvedVariant === 'secondary' || resolvedVariant === 'ghost'
        ? theme.colors.text
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
