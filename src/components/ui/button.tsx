import { useRef } from 'react';
import type { ReactNode } from 'react';
import {
  ActivityIndicator,
  Animated,
  Pressable,
  StyleSheet,
  Text,
} from 'react-native';
import type {
  GestureResponderEvent,
  PressableProps,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { useThemeValue } from '@/theme';
import type { ComponentSize, ComponentVariant } from './shared';
import { controlHeights, getVariantTokens } from './shared';

type ButtonProps = Omit<PressableProps, 'style'> & {
  children?: ReactNode;
  title?: string;
  variant?: ComponentVariant;
  size?: ComponentSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

const horizontalPaddingBySize: Record<ComponentSize, number> = {
  sm: 12,
  md: 16,
  lg: 20,
};

export const Button = ({
  children,
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftSlot,
  rightSlot,
  style,
  textStyle,
  onPressIn,
  onPressOut,
  ...props
}: ButtonProps) => {
  const theme = useThemeValue();
  const tokens = getVariantTokens(theme, variant);
  const scale = useRef(new Animated.Value(1)).current;
  const isDisabled = disabled || loading;

  const containerStyle = {
    minHeight: controlHeights[size],
    borderRadius: theme.radius.md,
    borderWidth: variant === 'ghost' ? 0 : 1,
    borderColor: tokens.border,
    backgroundColor:
      variant === 'secondary'
        ? theme.colors.surfaceAlt
        : variant === 'ghost'
          ? 'transparent'
          : tokens.background,
    paddingHorizontal: horizontalPaddingBySize[size],
    opacity: isDisabled ? theme.state.disabledOpacity : 1,
  };

  const labelStyle = {
    color:
      variant === 'secondary' || variant === 'ghost'
        ? theme.colors.text
        : tokens.foreground,
    ...theme.typography.button,
  };

  const handlePressIn = (event: GestureResponderEvent) => {
    Animated.timing(scale, {
      toValue: 0.97,
      duration: theme.motion.press,
      useNativeDriver: true,
    }).start();
    onPressIn?.(event);
  };

  const handlePressOut = (event: GestureResponderEvent) => {
    Animated.timing(scale, {
      toValue: 1,
      duration: theme.motion.press,
      useNativeDriver: true,
    }).start();
    onPressOut?.(event);
  };

  return (
    <Pressable
      disabled={isDisabled}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={({ pressed }) => [
        fullWidth && styles.fullWidth,
        pressed && !isDisabled && { opacity: theme.state.pressedOpacity },
      ]}
      {...props}
    >
      <Animated.View
        style={[
          styles.container,
          containerStyle,
          { transform: [{ scale }] },
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator
            size="small"
            color={
              variant === 'secondary' || variant === 'ghost'
                ? theme.colors.primary
                : tokens.foreground
            }
          />
        ) : (
          leftSlot
        )}
        {children ? (
          children
        ) : title ? (
          <Text style={[labelStyle, textStyle]}>{title}</Text>
        ) : null}
        {!loading ? rightSlot : null}
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
});
