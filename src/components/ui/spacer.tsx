import { View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { useThemeValue } from '@/theme';

type SpacerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

type SpacerProps = {
  size?: SpacerSize | number;
  horizontal?: boolean;
  style?: StyleProp<ViewStyle>;
};

export const Spacer = ({
  size = 'md',
  horizontal = false,
  style,
}: SpacerProps) => {
  const theme = useThemeValue();
  const value = typeof size === 'number' ? size : theme.spacing[size];
  const spacerStyle: ViewStyle = horizontal
    ? { width: value, height: 1 }
    : { height: value, width: 1 };

  return <View style={[spacerStyle, style]} />;
};
