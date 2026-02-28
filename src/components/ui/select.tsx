import { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { useThemeValue } from '@/theme';
import type { ComponentSize, ComponentVariant } from './shared';
import { controlHeights, getControlContainerStyle, getVariantTokens } from './shared';

export type SelectOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

type SelectProps = {
  value?: string;
  options: SelectOption[];
  onValueChange: (value: string) => void;
  placeholder?: string;
  title?: string;
  variant?: ComponentVariant;
  size?: ComponentSize;
  invalid?: boolean;
  disabled?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export const Select = ({
  value,
  options,
  onValueChange,
  placeholder = 'Select an option',
  title,
  variant = 'secondary',
  size = 'md',
  invalid = false,
  disabled = false,
  containerStyle,
  textStyle,
}: SelectProps) => {
  const [open, setOpen] = useState(false);
  const theme = useThemeValue();
  const tokens = getVariantTokens(theme, variant);
  const selectedOption = useMemo(
    () => options.find(option => option.value === value),
    [options, value],
  );
  const isDisabled = disabled;
  const triggerBaseStyle = getControlContainerStyle(theme, variant, size);
  const triggerStateStyle = {
    minHeight: controlHeights[size],
    opacity: isDisabled ? theme.state.disabledOpacity : 1,
    borderColor: invalid
      ? theme.colors.error
      : open
        ? theme.colors.accent
        : triggerBaseStyle.borderColor,
  };
  const triggerLabelStyle = {
    color: selectedOption ? theme.colors.text : theme.colors.inputPlaceholder,
    ...theme.typography.body,
  };
  const triggerStyle = {
    gap: theme.spacing.xs,
  };
  const backdropStyle = {
    backgroundColor: theme.backdrop.subtle,
    padding: theme.spacing.md,
  };
  const sheetStyle = {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    ...theme.elevation.lg,
  };
  const titleStyle = {
    color: theme.colors.text,
    ...theme.typography.h2,
  };

  const close = () => setOpen(false);

  const onSelect = (nextValue: string) => {
    onValueChange(nextValue);
    close();
  };

  return (
    <>
      <Pressable
        accessibilityRole="button"
        disabled={isDisabled}
        onPress={() => setOpen(true)}
        style={({ pressed }) => [
          pressed && !isDisabled && { opacity: theme.state.pressedOpacity },
        ]}
      >
        <View
          style={[
            styles.trigger,
            triggerStyle,
            triggerBaseStyle,
            triggerStateStyle,
            containerStyle,
          ]}
        >
          <Text
            numberOfLines={1}
            style={[styles.triggerLabel, triggerLabelStyle, textStyle]}
          >
            {selectedOption?.label ?? placeholder}
          </Text>
          <MaterialDesignIcons
            name="chevron-down"
            size={20}
            color={variant === 'primary' ? tokens.foreground : theme.colors.textMuted}
          />
        </View>
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={close}
      >
        <Pressable style={[styles.backdrop, backdropStyle]} onPress={close}>
          <Pressable
            style={[
              styles.sheet,
              sheetStyle,
              {
                padding: theme.spacing.md,
                gap: theme.spacing.sm,
              },
            ]}
            onPress={() => {}}
          >
            {title ? <Text style={titleStyle}>{title}</Text> : null}
            <ScrollView
              style={styles.list}
              contentContainerStyle={[
                styles.listContent,
                { gap: theme.spacing.xs },
              ]}
              showsVerticalScrollIndicator={false}
            >
              {options.map(option => {
                const isSelected = option.value === value;
                const optionStyle = {
                  borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                  backgroundColor: isSelected
                    ? theme.colors.primaryMuted
                    : theme.colors.surfaceAlt,
                  opacity: option.disabled ? theme.state.disabledOpacity : 1,
                };
                const optionTextStyle = {
                  color: isSelected ? theme.colors.accent : theme.colors.text,
                  ...theme.typography.body,
                };
                const optionContainerStyle = {
                  borderRadius: theme.radius.sm,
                  paddingHorizontal: theme.spacing.sm,
                };

                return (
                  <Pressable
                    key={option.value}
                    accessibilityRole="button"
                    disabled={option.disabled}
                    onPress={() => onSelect(option.value)}
                    style={[styles.option, optionContainerStyle, optionStyle]}
                  >
                    <Text style={[styles.optionLabel, optionTextStyle]}>
                      {option.label}
                    </Text>
                    {isSelected ? (
                      <MaterialDesignIcons
                        name="check"
                        size={18}
                        color={theme.colors.accent}
                      />
                    ) : null}
                  </Pressable>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  triggerLabel: {
    flex: 1,
  },
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    borderWidth: 1,
    maxHeight: '70%',
  },
  list: {
    flexGrow: 0,
  },
  listContent: {},
  option: {
    minHeight: controlHeights.sm,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionLabel: {
    flexShrink: 1,
  },
});
