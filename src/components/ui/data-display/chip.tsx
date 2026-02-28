import type { ReactNode } from 'react';
import { Pressable, Text } from 'react-native';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { useThemeValue } from '@/theme';
import type { ComponentSize, ComponentVariant } from '../primitives/shared';
import { getVariantTokens, sizeScale } from '../primitives/shared';

type ChipProps = {
  label: string;
  selected?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
  variant?: ComponentVariant;
  size?: ComponentSize;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export const Chip = ({
  label,
  selected = false,
  disabled = false,
  onPress,
  leftSlot,
  rightSlot,
  variant = 'secondary',
  size = 'md',
  style,
  textStyle,
}: ChipProps) => {
  const theme = useThemeValue();
  const tokens = getVariantTokens(theme, variant);
  const scale = sizeScale[size];
  const pressableStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs / 2,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: selected ? theme.colors.primary : tokens.border,
    backgroundColor: selected ? theme.colors.primaryMuted : theme.colors.surfaceAlt,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs / 2,
    opacity: disabled ? theme.state.disabledOpacity : 1,
  };
  const labelStyle: TextStyle = {
    color: selected
      ? theme.colors.accent
      : variant === 'secondary' || variant === 'ghost'
        ? theme.colors.text
        : tokens.foreground,
    ...theme.typography.bodySm,
    fontSize: theme.typography.bodySm.fontSize * scale,
  };

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        pressableStyle,
        pressed && !disabled && { opacity: theme.state.pressedOpacity },
        style,
      ]}
    >
      {leftSlot}
      <Text style={[labelStyle, textStyle]}>{label}</Text>
      {rightSlot}
    </Pressable>
  );
};
