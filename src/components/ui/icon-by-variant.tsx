import { StyleSheet, Text, View } from 'react-native';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { useThemeValue } from '@/theme';
import type { ComponentSize, ComponentVariant } from './shared';
import { getVariantTokens, iconSizes } from './shared';

type IconByVariantProps = {
  variant?: ComponentVariant;
  size?: ComponentSize;
  icons?: Partial<Record<ComponentVariant, string>>;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

const defaultIcons: Record<ComponentVariant, string> = {
  primary: '+',
  secondary: 'o',
  destructive: '!',
};

export const IconByVariant = ({
  variant = 'primary',
  size = 'md',
  icons,
  style,
  textStyle,
}: IconByVariantProps) => {
  const theme = useThemeValue();
  const tokens = getVariantTokens(theme, variant);
  const icon = icons?.[variant] ?? defaultIcons[variant];
  const fontSize = iconSizes[size];
  const containerStyle = {
    width: fontSize * 1.6,
    height: fontSize * 1.6,
    borderRadius: fontSize,
    backgroundColor: tokens.backgroundMuted,
  };
  const iconStyle = {
    fontSize,
    lineHeight: fontSize * 1.1,
    color: variant === 'secondary' ? theme.colors.textMuted : tokens.background,
    fontWeight: theme.typography.kicker.fontWeight,
  };

  return (
    <View style={[styles.container, containerStyle, style]}>
      <Text style={[iconStyle, textStyle]}>{icon}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
