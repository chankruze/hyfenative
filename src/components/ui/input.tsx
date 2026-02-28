import { forwardRef } from 'react';
import type { ReactNode } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import type {
  StyleProp,
  TextInputProps,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { useThemeValue } from '@/theme';
import type { ComponentSize, ComponentVariant } from './shared';
import { getControlContainerStyle } from './shared';

type InputProps = Omit<TextInputProps, 'style'> & {
  variant?: ComponentVariant;
  size?: ComponentSize;
  invalid?: boolean;
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
};

export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      variant = 'secondary',
      size = 'md',
      invalid = false,
      leftSlot,
      rightSlot,
      containerStyle,
      inputStyle,
      editable = true,
      placeholderTextColor,
      ...props
    },
    ref,
  ) => {
    const theme = useThemeValue();
    const containerStateStyle = {
      borderColor: invalid ? theme.colors.error : undefined,
      opacity: editable ? 1 : 0.75,
    };
    const textStyle = {
      color: theme.colors.text,
    };

    return (
      <View
        style={[
          getControlContainerStyle(theme, variant, size),
          styles.container,
          { gap: theme.spacing.xs / 2 },
          containerStateStyle,
          containerStyle,
        ]}
      >
        {leftSlot}
        <TextInput
          ref={ref}
          editable={editable}
          placeholderTextColor={
            placeholderTextColor ?? theme.colors.inputPlaceholder
          }
          style={[styles.input, theme.typography.body, textStyle, inputStyle]}
          {...props}
        />
        {rightSlot}
      </View>
    );
  },
);

Input.displayName = 'Input';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    paddingVertical: 0,
  },
});
