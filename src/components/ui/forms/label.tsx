import { forwardRef } from 'react';
import { Text } from 'react-native';
import type { StyleProp, TextProps, TextStyle } from 'react-native';
import { useThemeValue } from '@/theme';

type LabelProps = Omit<TextProps, 'style'> & {
  htmlFor?: string;
  style?: StyleProp<TextStyle>;
};

export const Label = forwardRef<Text, LabelProps>(
  ({ htmlFor, style, ...props }, ref) => {
    const theme = useThemeValue();
    const labelStyle: TextStyle = {
      color: theme.colors.textMuted,
      ...theme.typography.label,
    };

    return (
      <Text
        ref={ref}
        nativeID={htmlFor ? `${htmlFor}__label` : props.nativeID}
        style={[labelStyle, style]}
        {...props}
      />
    );
  },
);

Label.displayName = 'Label';
