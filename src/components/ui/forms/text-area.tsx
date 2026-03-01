import { forwardRef, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import type {
  StyleProp,
  TextInputProps,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { useThemeValue } from '@/theme';
import type { ComponentSize, ComponentVariant } from '../primitives/shared';
import { controlHeights, getControlContainerStyle } from '../primitives/shared';

type TextAreaProps = Omit<TextInputProps, 'style' | 'multiline'> & {
  variant?: ComponentVariant;
  size?: ComponentSize;
  invalid?: boolean;
  minRows?: number;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
};

export const TextArea = forwardRef<TextInput, TextAreaProps>(
  (
    {
      variant = 'secondary',
      size = 'md',
      invalid = false,
      minRows = 3,
      containerStyle,
      inputStyle,
      editable = true,
      placeholderTextColor,
      onFocus,
      onBlur,
      ...props
    },
    ref,
  ) => {
    const theme = useThemeValue();
    const [focused, setFocused] = useState(false);
    const controlStyle = getControlContainerStyle(theme, variant, size);
    const minHeight = controlHeights[size] * minRows;
    const containerStateStyle: ViewStyle = {
      borderColor: invalid
        ? theme.colors.error
        : focused
          ? theme.colors.accent
          : controlStyle.borderColor,
      opacity: editable ? 1 : theme.state.disabledOpacity,
      minHeight,
      paddingVertical: theme.spacing.xs,
      alignItems: 'stretch',
    };
    const textStyle = {
      color: theme.colors.text,
    };

    return (
      <View style={[controlStyle, containerStateStyle, containerStyle]}>
        <TextInput
          ref={ref}
          multiline
          editable={editable}
          onFocus={event => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={event => {
            setFocused(false);
            onBlur?.(event);
          }}
          placeholderTextColor={
            placeholderTextColor ?? theme.colors.inputPlaceholder
          }
          textAlignVertical="top"
          style={[styles.input, theme.typography.body, textStyle, inputStyle]}
          {...props}
        />
      </View>
    );
  },
);

TextArea.displayName = 'TextArea';

const styles = StyleSheet.create({
  input: {
    flex: 1,
    paddingVertical: 0,
  },
});
