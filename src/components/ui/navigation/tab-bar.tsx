import { Pressable, Text, View } from 'react-native';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import type { MaterialDesignIconsIconName } from '@react-native-vector-icons/material-design-icons';
import { useThemeValue } from '@/theme';
import { IconByVariant } from '../primitives/icon-by-variant';

type TabBarItem = {
  key: string;
  label: string;
  icon?: MaterialDesignIconsIconName;
  disabled?: boolean;
};

type TabBarProps = {
  items: TabBarItem[];
  activeKey: string;
  onChange: (key: string) => void;
  style?: StyleProp<ViewStyle>;
  itemStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
};

export const TabBar = ({
  items,
  activeKey,
  onChange,
  style,
  itemStyle,
  labelStyle,
}: TabBarProps) => {
  const theme = useThemeValue();
  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.xs / 2,
    gap: theme.spacing.xs / 2,
  };

  return (
    <View style={[containerStyle, style]}>
      {items.map(item => {
        const isActive = item.key === activeKey;
        const tabStyle: ViewStyle = {
          flex: 1,
          minHeight: 40,
          borderRadius: theme.radius.md,
          borderWidth: 1,
          borderColor: isActive ? theme.colors.primary : 'transparent',
          backgroundColor: isActive ? theme.colors.primaryMuted : 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          gap: theme.spacing.xs / 2,
          opacity: item.disabled ? theme.state.disabledOpacity : 1,
        };
        const tabTextStyle: TextStyle = {
          color: isActive ? theme.colors.accent : theme.colors.textMuted,
          ...theme.typography.bodySm,
        };

        return (
          <Pressable
            key={item.key}
            disabled={item.disabled}
            onPress={() => onChange(item.key)}
            style={({ pressed }) => [
              tabStyle,
              pressed && !item.disabled && { opacity: theme.state.pressedOpacity },
              itemStyle,
            ]}
          >
            {item.icon ? (
              <IconByVariant
                name={item.icon}
                variant={isActive ? 'primary' : 'secondary'}
                size="sm"
                color={isActive ? theme.colors.accent : theme.colors.textMuted}
              />
            ) : null}
            <Text style={[tabTextStyle, labelStyle]} numberOfLines={1}>
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};
