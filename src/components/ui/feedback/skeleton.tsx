import { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { useThemeValue } from '@/theme';
import type { ComponentSize, ComponentVariant } from '../primitives/shared';
import { controlHeights, getVariantTokens } from '../primitives/shared';

type SkeletonProps = {
  variant?: ComponentVariant;
  size?: ComponentSize;
  width?: number | `${number}%`;
  height?: number;
  radius?: number;
  style?: StyleProp<ViewStyle>;
};

export const Skeleton = ({
  variant = 'secondary',
  size = 'md',
  width = '100%',
  height,
  radius,
  style,
}: SkeletonProps) => {
  const theme = useThemeValue();
  const tokens = getVariantTokens(theme, variant);
  const pulse = useRef(new Animated.Value(0.45)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 0.9,
          duration: 700,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.45,
          duration: 700,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();

    return () => {
      animation.stop();
    };
  }, [pulse]);

  const backgroundColor = useMemo(() => {
    if (variant === 'primary') {
      return tokens.backgroundMuted;
    }

    if (variant === 'destructive') {
      return tokens.backgroundMuted;
    }

    return theme.colors.surfaceAlt;
  }, [theme.colors.surfaceAlt, tokens.backgroundMuted, variant]);

  return (
    <Animated.View
      style={[
        {
          width,
          height: height ?? controlHeights[size] * 0.45,
          borderRadius: radius ?? theme.radius.sm,
          backgroundColor,
          opacity: pulse,
        },
        style,
      ]}
    />
  );
};
