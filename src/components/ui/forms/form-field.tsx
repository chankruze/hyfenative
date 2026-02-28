import type { ReactNode } from 'react';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import type { ComponentSize, ComponentVariant } from '../primitives/shared';
import { sizeScale } from '../primitives/shared';
import { Field, FieldDescription, FieldError, FieldLabel } from './field';

type FormFieldProps = {
  label?: string;
  description?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  optionalText?: string;
  labelRight?: ReactNode;
  variant?: ComponentVariant;
  size?: ComponentSize;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  messageStyle?: StyleProp<TextStyle>;
};

export const FormField = ({
  label,
  description,
  hint,
  error,
  required = false,
  optionalText = 'Optional',
  labelRight,
  variant: _variant = 'secondary',
  size = 'md',
  children,
  style,
  labelStyle,
  messageStyle,
}: FormFieldProps) => {
  const scale = sizeScale[size];
  const helpText = description ?? hint;

  return (
    <Field
      style={[
        {
          gap: 4 * scale,
        },
        style,
      ]}
      invalid={Boolean(error)}
    >
      {label ? (
        <FieldLabel style={labelStyle}>
          {label}
          {required ? ' *' : ''}
          {!required && optionalText ? ` (${optionalText})` : ''}
        </FieldLabel>
      ) : null}
      {labelRight}
      {children}
      <FieldError style={messageStyle}>{error}</FieldError>
      {!error ? (
        <FieldDescription style={messageStyle}>{helpText}</FieldDescription>
      ) : null}
    </Field>
  );
};
