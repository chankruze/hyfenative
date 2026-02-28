import type { ReactNode } from 'react';
import { Pressable, Text } from 'react-native';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import type { MaterialDesignIconsIconName } from '@react-native-vector-icons/material-design-icons';
import { useThemeValue } from '@/theme';
import { IconByVariant } from './icon-by-variant';
import type { ComponentSize, ComponentVariant } from './shared';
import { getVariantTokens, sizeScale } from './shared';

type TagProps = {
  label: string;
  variant?: ComponentVariant;
  size?: ComponentSize;
  icon?: MaterialDesignIconsIconName;
  removable?: boolean;
  onRemove?: () => void;
  rightSlot?: ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export const Tag = ({
  label,
  variant = 'secondary',
  size = 'sm',
  icon,
  removable = false,
  onRemove,
  rightSlot,
  style,
  textStyle,
}: TagProps) => {
  const theme = useThemeValue();
  const tokens = getVariantTokens(theme, variant);
  const scale = sizeScale[size];
  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: theme.spacing.xs / 2,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: tokens.border,
    backgroundColor:
      variant === 'secondary' || variant === 'ghost'
        ? theme.colors.surfaceAlt
        : tokens.backgroundMuted,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: theme.spacing.xs / 3,
  };
  const labelStyle: TextStyle = {
    color:
      variant === 'secondary' || variant === 'ghost'
        ? theme.colors.text
        : tokens.foreground,
    ...theme.typography.label,
    fontSize: theme.typography.label.fontSize * scale,
  };

  return (
    <Pressable
      disabled={!removable || !onRemove}
      onPress={onRemove}
      style={({ pressed }) => [
        containerStyle,
        pressed && removable && { opacity: theme.state.pressedOpacity },
        style,
      ]}
    >
      {icon ? <IconByVariant name={icon} variant={variant} size={size} /> : null}
      <Text style={[labelStyle, textStyle]}>{label}</Text>
      {rightSlot}
      {removable ? (
        <IconByVariant
          name="close"
          variant={variant}
          size={size}
          color={variant === 'secondary' ? theme.colors.textMuted : undefined}
        />
      ) : null}
    </Pressable>
  );
};
