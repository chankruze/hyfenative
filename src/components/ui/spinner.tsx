import { ActivityIndicator, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { useThemeValue } from '@/theme';
import type { ComponentSize, ComponentVariant } from './shared';
import { getVariantTokens, spinnerSizes } from './shared';

type SpinnerProps = {
  variant?: ComponentVariant;
  size?: ComponentSize;
  style?: StyleProp<ViewStyle>;
};

export const Spinner = ({
  variant = 'primary',
  size = 'md',
  style,
}: SpinnerProps) => {
  const theme = useThemeValue();
  const tokens = getVariantTokens(theme, variant);
  const spinnerSize = spinnerSizes[size];

  return (
    <View style={style}>
      <ActivityIndicator
        size={spinnerSize}
        color={
          variant === 'secondary' ? theme.colors.primary : tokens.background
        }
      />
    </View>
  );
};
