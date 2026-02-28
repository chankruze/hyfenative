import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import type { MaterialDesignIconsIconName } from '@react-native-vector-icons/material-design-icons';
import { useThemeValue } from '@/theme';
import { IconByVariant } from './icon-by-variant';
import type { ComponentVariant } from './shared';

type AlertProps = {
  title?: string;
  description?: string;
  variant?: ComponentVariant;
  icon?: MaterialDesignIconsIconName;
  action?: ReactNode;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  descriptionStyle?: StyleProp<TextStyle>;
};

const defaultIconByVariant: Record<ComponentVariant, MaterialDesignIconsIconName> = {
  primary: 'information-outline',
  secondary: 'information-outline',
  ghost: 'information-outline',
  destructive: 'alert-circle-outline',
};

export const Alert = ({
  title,
  description,
  variant = 'secondary',
  icon,
  action,
  style,
  titleStyle,
  descriptionStyle,
}: AlertProps) => {
  const theme = useThemeValue();
  const isDestructive = variant === 'destructive';
  const containerStyle: ViewStyle = {
    borderWidth: 1,
    borderRadius: theme.radius.md,
    borderColor: isDestructive ? theme.colors.error : theme.colors.border,
    backgroundColor: isDestructive
      ? theme.colors.primaryMuted
      : theme.colors.surfaceAlt,
    padding: theme.spacing.sm,
    gap: theme.spacing.xs,
  };
  const rowStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.xs,
  };
  const contentStyle: ViewStyle = {
    flex: 1,
    gap: theme.spacing.xs / 4,
  };
  const titleTextStyle: TextStyle = {
    color: isDestructive ? theme.colors.error : theme.colors.text,
    ...theme.typography.label,
  };
  const descriptionTextStyle: TextStyle = {
    color: theme.colors.textMuted,
    ...theme.typography.bodySm,
  };
  const iconName = icon ?? defaultIconByVariant[variant];

  return (
    <View style={[containerStyle, style]}>
      <View style={rowStyle}>
        <IconByVariant
          name={iconName}
          variant={isDestructive ? 'destructive' : 'secondary'}
          size="md"
        />
        <View style={contentStyle}>
          {title ? <Text style={[titleTextStyle, titleStyle]}>{title}</Text> : null}
          {description ? (
            <Text style={[descriptionTextStyle, descriptionStyle]}>
              {description}
            </Text>
          ) : null}
        </View>
      </View>
      {action}
    </View>
  );
};
