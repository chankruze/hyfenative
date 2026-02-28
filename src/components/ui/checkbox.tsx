import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { useThemeValue } from '@/theme';
import type { ComponentSize, ComponentVariant } from './shared';
import { getVariantTokens } from './shared';

type CheckboxProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  variant?: ComponentVariant;
  size?: ComponentSize;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  descriptionStyle?: StyleProp<TextStyle>;
};

const boxSizeByVariant: Record<ComponentSize, number> = {
  sm: 18,
  md: 22,
  lg: 26,
};

export const Checkbox = ({
  checked,
  onCheckedChange,
  label,
  description,
  variant = 'primary',
  size = 'md',
  disabled = false,
  style,
  labelStyle,
  descriptionStyle,
}: CheckboxProps) => {
  const theme = useThemeValue();
  const tokens = getVariantTokens(theme, variant);
  const boxSize = boxSizeByVariant[size];
  const isSubtle = variant === 'secondary' || variant === 'ghost';
  const boxStyle = {
    width: boxSize,
    height: boxSize,
    borderRadius: theme.radius.sm * 0.6,
    borderColor: checked ? tokens.border : theme.colors.borderStrong,
    backgroundColor: checked
      ? isSubtle
        ? theme.colors.primary
        : tokens.background
      : 'transparent',
  };
  const checkColor = isSubtle ? theme.colors.textInverse : tokens.foreground;
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
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      disabled={disabled}
      onPress={() => onCheckedChange(!checked)}
      style={[styles.container, containerStyle, style]}
    >
      <View style={[styles.box, boxStyle]}>
        {checked ? (
          <MaterialDesignIcons name="check" size={boxSize * 0.72} color={checkColor} />
        ) : null}
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
  box: {
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
});
