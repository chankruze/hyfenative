import type { ReactNode } from 'react';
import { View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { useThemeValue } from '@/theme';
import { Header } from './header';

type AppBarProps = {
  title: string;
  subtitle?: string;
  left?: ReactNode;
  right?: ReactNode;
  elevated?: boolean;
  style?: StyleProp<ViewStyle>;
};

export const AppBar = ({
  title,
  subtitle,
  left,
  right,
  elevated = false,
  style,
}: AppBarProps) => {
  const theme = useThemeValue();
  const containerStyle: ViewStyle = {
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.xs,
    paddingBottom: theme.spacing.xs,
  };

  return (
    <View
      style={[
        containerStyle,
        elevated ? theme.elevation.sm : undefined,
        style,
      ]}
    >
      <Header title={title} subtitle={subtitle} left={left} right={right} />
    </View>
  );
};
