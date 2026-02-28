import { forwardRef, useState } from 'react';
import type { ReactNode } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import type {
  StyleProp,
  TextInputProps,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { useThemeValue } from '@/theme';
import type { ComponentSize, ComponentVariant } from '../primitives/shared';
import { getControlContainerStyle } from '../primitives/shared';

type InputProps = Omit<TextInputProps, 'style'> & {
  id?: string;
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
      id,
      leftSlot,
      rightSlot,
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
    const containerStateStyle = {
      borderColor: invalid
        ? theme.colors.error
        : focused
          ? theme.colors.accent
          : controlStyle.borderColor,
      opacity: editable ? 1 : theme.state.disabledOpacity,
    };
    const textStyle = {
      color: theme.colors.text,
    };

    return (
      <View
        style={[
          controlStyle,
          styles.container,
          { gap: theme.spacing.xs / 2 },
          containerStateStyle,
          containerStyle,
        ]}
      >
        {leftSlot}
        <TextInput
          ref={ref}
          nativeID={id}
          accessibilityLabelledBy={
            props.accessibilityLabelledBy ?? (id ? `${id}__label` : undefined)
          }
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
