import { Switch as RNSwitch, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { useThemeValue } from '@/theme';
import type { ComponentSize, ComponentVariant } from '../primitives/shared';
import { getVariantTokens } from '../primitives/shared';

type SwitchProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  variant?: ComponentVariant;
  size?: ComponentSize;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

const scaleBySize: Record<ComponentSize, number> = {
  sm: 0.85,
  md: 1,
  lg: 1.15,
};

export const Switch = ({
  value,
  onValueChange,
  variant = 'primary',
  size = 'md',
  disabled = false,
  style,
}: SwitchProps) => {
  const theme = useThemeValue();
  const tokens = getVariantTokens(theme, variant);
  const activeTrackColor =
    variant === 'secondary' || variant === 'ghost'
      ? theme.colors.primary
      : tokens.background;
  const inactiveTrackColor = theme.colors.borderStrong;
  const thumbColor =
    variant === 'primary' || variant === 'destructive'
      ? tokens.foreground
      : theme.colors.surface;
  const containerStyle = {
    transform: [{ scale: scaleBySize[size] }],
    opacity: disabled ? theme.state.disabledOpacity : 1,
  };

  return (
    <View style={[containerStyle, style]}>
      <RNSwitch
        disabled={disabled}
        value={value}
        onValueChange={onValueChange}
        trackColor={{
          false: inactiveTrackColor,
          true: activeTrackColor,
        }}
        thumbColor={thumbColor}
      />
    </View>
  );
};
