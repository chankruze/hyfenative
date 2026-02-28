import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { useThemeValue } from '@/theme';

type HeaderProps = {
  title: string;
  subtitle?: string;
  left?: ReactNode;
  right?: ReactNode;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  subtitleStyle?: StyleProp<TextStyle>;
};

export const Header = ({
  title,
  subtitle,
  left,
  right,
  style,
  titleStyle,
  subtitleStyle,
}: HeaderProps) => {
  const theme = useThemeValue();
  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  };
  const contentStyle: ViewStyle = {
    flex: 1,
    gap: theme.spacing.xs / 4,
  };
  const titleTextStyle: TextStyle = {
    color: theme.colors.text,
    ...theme.typography.h2,
  };
  const subtitleTextStyle: TextStyle = {
    color: theme.colors.textMuted,
    ...theme.typography.bodySm,
  };

  return (
    <View style={[containerStyle, style]}>
      {left}
      <View style={contentStyle}>
        <Text numberOfLines={1} style={[titleTextStyle, titleStyle]}>
          {title}
        </Text>
        {subtitle ? (
          <Text numberOfLines={2} style={[subtitleTextStyle, subtitleStyle]}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right}
    </View>
  );
};
