import type { ReactNode } from 'react';
import { View } from 'react-native';
import type { StyleProp, ViewProps, ViewStyle } from 'react-native';
import { useThemeValue } from '@/theme';

type StackSpacing = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

type StackProps = Omit<ViewProps, 'style'> & {
  children?: ReactNode;
  spacing?: StackSpacing | number;
  style?: StyleProp<ViewStyle>;
};

export const Stack = ({
  children,
  spacing = 'md',
  style,
  ...props
}: StackProps) => {
  const theme = useThemeValue();
  const gap = typeof spacing === 'number' ? spacing : theme.spacing[spacing];
  const containerStyle: ViewStyle = {
    flexDirection: 'column',
    gap,
  };

  return (
    <View style={[containerStyle, style]} {...props}>
      {children}
    </View>
  );
};
