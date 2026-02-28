import { View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { useThemeValue } from '@/theme';

type DividerProps = {
  orientation?: 'horizontal' | 'vertical';
  thickness?: number;
  inset?: number;
  style?: StyleProp<ViewStyle>;
};

export const Divider = ({
  orientation = 'horizontal',
  thickness = 1,
  inset = 0,
  style,
}: DividerProps) => {
  const theme = useThemeValue();
  const dividerStyle: ViewStyle =
    orientation === 'horizontal'
      ? {
          height: thickness,
          marginLeft: inset,
          marginRight: inset,
          width: 'auto',
        }
      : {
          width: thickness,
          marginTop: inset,
          marginBottom: inset,
          alignSelf: 'stretch',
        };

  return (
    <View
      accessibilityRole="none"
      style={[dividerStyle, { backgroundColor: theme.colors.border }, style]}
    />
  );
};
