import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { useThemeValue } from '@/theme';
import type { ComponentSize, ComponentVariant } from './shared';
import { getVariantTokens, sizeScale } from './shared';

type FormFieldProps = {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
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
  error,
  required = false,
  variant = 'secondary',
  size = 'md',
  children,
  style,
  labelStyle,
  messageStyle,
}: FormFieldProps) => {
  const theme = useThemeValue();
  const tokens = getVariantTokens(theme, variant);
  const scale = sizeScale[size];

  return (
    <View style={[{ gap: theme.spacing.xs / 2 }, style]}>
      {label ? (
        <Text
          style={[
            {
              color: theme.colors.textMuted,
              ...theme.typography.label,
              fontSize: theme.typography.label.fontSize * scale,
            },
            labelStyle,
          ]}
        >
          {label}
          {required ? ' *' : ''}
        </Text>
      ) : null}

      {children}

      {error ? (
        <Text
          style={[
            {
              color: theme.colors.error,
              ...theme.typography.bodySm,
              fontSize: theme.typography.bodySm.fontSize * scale,
            },
            messageStyle,
          ]}
        >
          {error}
        </Text>
      ) : description ? (
        <Text
          style={[
            {
              color:
                variant === 'secondary'
                  ? theme.colors.textMuted
                  : tokens.border,
              ...theme.typography.bodySm,
              fontSize: theme.typography.bodySm.fontSize * scale,
            },
            messageStyle,
          ]}
        >
          {description}
        </Text>
      ) : null}
    </View>
  );
};
