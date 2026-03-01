import type { ComponentProps, ReactNode } from 'react';
import { Text, View } from 'react-native';
import type { StyleProp, TextStyle, ViewProps, ViewStyle } from 'react-native';
import { useThemeValue } from '@/theme';
import { Label } from './label';

type FieldProps = Omit<ViewProps, 'style'> & {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  orientation?: 'vertical' | 'horizontal';
  disabled?: boolean;
  invalid?: boolean;
};

type FieldLabelProps = ComponentProps<typeof Label>;

type FieldDescriptionProps = {
  children?: ReactNode;
  style?: StyleProp<TextStyle>;
};

type FieldErrorProps = {
  children?: ReactNode;
  style?: StyleProp<TextStyle>;
};

const hasContent = (value: ReactNode) => {
  if (value === null || value === undefined || value === false) {
    return false;
  }

  if (typeof value === 'string') {
    return value.trim().length > 0;
  }

  return true;
};

export const Field = ({
  children,
  style,
  orientation = 'vertical',
  disabled = false,
  invalid = false,
  ...props
}: FieldProps) => {
  const theme = useThemeValue();
  const containerStyle: ViewStyle = {
    flexDirection: orientation === 'horizontal' ? 'row' : 'column',
    alignItems: orientation === 'horizontal' ? 'center' : 'stretch',
    gap: theme.spacing.xs / 2,
    opacity: disabled ? theme.state.disabledOpacity : 1,
  };
  const invalidStyle: ViewStyle | undefined = invalid
    ? { borderColor: theme.colors.error }
    : undefined;

  return (
    <View style={[containerStyle, invalidStyle, style]} {...props}>
      {children}
    </View>
  );
};

export const FieldLabel = ({ style, ...props }: FieldLabelProps) => {
  const theme = useThemeValue();
  const labelStyle: TextStyle = {
    color: theme.colors.textMuted,
    ...theme.typography.label,
  };

  return <Label style={[labelStyle, style]} {...props} />;
};

export const FieldDescription = ({ children, style }: FieldDescriptionProps) => {
  const theme = useThemeValue();

  if (!hasContent(children)) {
    return null;
  }

  const descriptionStyle: TextStyle = {
    color: theme.colors.textMuted,
    ...theme.typography.bodySm,
  };

  return <Text style={[descriptionStyle, style]}>{children}</Text>;
};

export const FieldError = ({ children, style }: FieldErrorProps) => {
  const theme = useThemeValue();

  if (!hasContent(children)) {
    return null;
  }

  const errorStyle: TextStyle = {
    color: theme.colors.error,
    ...theme.typography.bodySm,
  };

  return (
    <Text accessibilityRole="alert" style={[errorStyle, style]}>
      {children}
    </Text>
  );
};
