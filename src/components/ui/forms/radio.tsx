import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { useThemeValue } from '@/theme';
import type { ComponentSize, ComponentVariant } from '../primitives/shared';
import { getVariantTokens } from '../primitives/shared';

type RadioProps = {
  selected: boolean;
  onSelect: () => void;
  label?: string;
  description?: string;
  variant?: ComponentVariant;
  size?: ComponentSize;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  descriptionStyle?: StyleProp<TextStyle>;
};

const outerSizeByVariant: Record<ComponentSize, number> = {
  sm: 18,
  md: 22,
  lg: 26,
};

const innerSizeByVariant: Record<ComponentSize, number> = {
  sm: 8,
  md: 10,
  lg: 12,
};

export const Radio = ({
  selected,
  onSelect,
  label,
  description,
  variant = 'primary',
  size = 'md',
  disabled = false,
  style,
  labelStyle,
  descriptionStyle,
}: RadioProps) => {
  const theme = useThemeValue();
  const tokens = getVariantTokens(theme, variant);
  const outerSize = outerSizeByVariant[size];
  const innerSize = innerSizeByVariant[size];
  const isSubtle = variant === 'secondary' || variant === 'ghost';
  const ringStyle = {
    width: outerSize,
    height: outerSize,
    borderRadius: outerSize / 2,
    borderColor: selected ? tokens.border : theme.colors.borderStrong,
  };
  const dotStyle = {
    width: innerSize,
    height: innerSize,
    borderRadius: innerSize / 2,
    backgroundColor: isSubtle ? theme.colors.primary : tokens.background,
  };
  const labelTextStyle = {
    color: theme.colors.text,
    ...theme.typography.body,
  };
  const descriptionTextStyle = {
    color: theme.colors.textMuted,
    ...theme.typography.bodySm,
  };
  const containerStyle = {
    opacity: disabled ? theme.state.disabledOpacity : 1,
    gap: theme.spacing.xs,
  };
  const contentStyle = {
    gap: theme.spacing.xs / 4,
  };

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: selected, disabled }}
      disabled={disabled}
      onPress={onSelect}
      style={[styles.container, containerStyle, style]}
    >
      <View style={[styles.ring, ringStyle]}>
        {selected ? <View style={dotStyle} /> : null}
      </View>

      {label ? (
        <View style={[styles.content, contentStyle]}>
          <Text style={[labelTextStyle, labelStyle]}>{label}</Text>
          {description ? (
            <Text style={[descriptionTextStyle, descriptionStyle]}>
              {description}
            </Text>
          ) : null}
        </View>
      ) : null}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ring: {
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
});
