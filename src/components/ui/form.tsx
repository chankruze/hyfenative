import { useState } from 'react';
import { View } from 'react-native';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { useThemeValue } from '@/theme';

type FormSpacing = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

type FormRenderProps = {
  submit: () => void;
  submitting: boolean;
  disabled: boolean;
};

type FormProps = {
  children: ReactNode | ((props: FormRenderProps) => ReactNode);
  onSubmit?: () => void | Promise<void>;
  submitting?: boolean;
  disabled?: boolean;
  spacing?: FormSpacing | number;
  style?: StyleProp<ViewStyle>;
};

const isPromiseLike = (value: unknown): value is Promise<unknown> =>
  Boolean(value) && typeof (value as Promise<unknown>).then === 'function';

const swallow = () => undefined;

export const Form = ({
  children,
  onSubmit,
  submitting,
  disabled = false,
  spacing = 'md',
  style,
}: FormProps) => {
  const theme = useThemeValue();
  const [internalSubmitting, setInternalSubmitting] = useState(false);
  const effectiveSubmitting = submitting ?? internalSubmitting;
  const effectiveDisabled = disabled || effectiveSubmitting;
  const gap = typeof spacing === 'number' ? spacing : theme.spacing[spacing];

  const submit = async () => {
    if (!onSubmit || effectiveDisabled) {
      return;
    }

    const result = onSubmit();
    if (!isPromiseLike(result) || submitting !== undefined) {
      return;
    }

    setInternalSubmitting(true);
    try {
      await result;
    } finally {
      setInternalSubmitting(false);
    }
  };

  const content =
    typeof children === 'function'
      ? children({
          submit: () => {
            submit().catch(swallow);
          },
          submitting: effectiveSubmitting,
          disabled: effectiveDisabled,
        })
      : children;

  return <View style={[{ gap }, style]}>{content}</View>;
};
