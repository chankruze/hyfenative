import type { ReactNode } from 'react';
import { View } from 'react-native';
import type { StyleProp, ViewProps, ViewStyle } from 'react-native';
import { useThemeValue } from '@/theme';

type StackSpacing = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type Alignment = 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
type Justification =
  | 'flex-start'
  | 'center'
  | 'flex-end'
  | 'space-between'
  | 'space-around'
  | 'space-evenly';

type HStackProps = Omit<ViewProps, 'style'> & {
  children?: ReactNode;
  spacing?: StackSpacing | number;
  align?: Alignment;
  justify?: Justification;
  style?: StyleProp<ViewStyle>;
};

export const HStack = ({
  children,
  spacing = 'md',
  align = 'center',
  justify = 'flex-start',
  style,
  ...props
}: HStackProps) => {
  const theme = useThemeValue();
  const value = typeof spacing === 'number' ? spacing : theme.spacing[spacing];
  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: align,
    justifyContent: justify,
    gap: value,
  };

  return (
    <View style={[containerStyle, style]} {...props}>
      {children}
    </View>
  );
};
