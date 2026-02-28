import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import type { StyleProp, ViewProps, ViewStyle } from 'react-native';
import { useThemeValue } from '@/theme';

type CardElevation = 'none' | 'sm' | 'md' | 'lg';
type CardPadding = 'none' | 'sm' | 'md' | 'lg';
type CardSurface = 'default' | 'alt';

type CardProps = Omit<ViewProps, 'style'> & {
  children?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  elevation?: CardElevation;
  padding?: CardPadding;
  surface?: CardSurface;
  style?: StyleProp<ViewStyle>;
};

const paddingStyles: Record<CardPadding, keyof typeof styles> = {
  none: 'paddingNone',
  sm: 'paddingSm',
  md: 'paddingMd',
  lg: 'paddingLg',
};

export const Card = ({
  children,
  header,
  footer,
  elevation = 'sm',
  padding = 'md',
  surface = 'default',
  style,
  ...props
}: CardProps) => {
  const theme = useThemeValue();
  const containerStyle = {
    borderRadius: theme.radius.lg,
    borderColor: theme.colors.border,
    backgroundColor:
      surface === 'default' ? theme.colors.surface : theme.colors.surfaceAlt,
  };
  const elevationStyle =
    elevation === 'none' ? undefined : theme.elevation[elevation];
  const dividerStyle = {
    borderColor: theme.colors.border,
  };

  return (
    <View style={[styles.base, containerStyle, elevationStyle, style]} {...props}>
      {header ? (
        <View style={[styles.slot, styles.headerSlot, dividerStyle]}>{header}</View>
      ) : null}

      <View style={[styles.slot, styles[paddingStyles[padding]]]}>{children}</View>

      {footer ? (
        <View style={[styles.slot, styles.footerSlot, dividerStyle]}>{footer}</View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderWidth: 1,
    overflow: 'hidden',
  },
  slot: {
    width: '100%',
  },
  headerSlot: {
    borderBottomWidth: 1,
  },
  footerSlot: {
    borderTopWidth: 1,
  },
  paddingNone: {
    padding: 0,
  },
  paddingSm: {
    padding: 12,
  },
  paddingMd: {
    padding: 16,
  },
  paddingLg: {
    padding: 20,
  },
});
