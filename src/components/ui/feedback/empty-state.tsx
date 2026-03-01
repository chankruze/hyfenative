import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import type { MaterialDesignIconsIconName } from '@react-native-vector-icons/material-design-icons';
import { useThemeValue } from '@/theme';
import { IconByVariant } from '../primitives/icon-by-variant';

type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: MaterialDesignIconsIconName;
  action?: ReactNode;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  descriptionStyle?: StyleProp<TextStyle>;
};

export const EmptyState = ({
  title,
  description,
  icon = 'inbox-outline',
  action,
  style,
  titleStyle,
  descriptionStyle,
}: EmptyStateProps) => {
  const theme = useThemeValue();
  const containerStyle: ViewStyle = {
    borderWidth: 1,
    borderRadius: theme.radius.lg,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    alignItems: 'center',
    gap: theme.spacing.sm,
  };
  const titleTextStyle: TextStyle = {
    color: theme.colors.text,
    ...theme.typography.h2,
    textAlign: 'center',
  };
  const descriptionTextStyle: TextStyle = {
    color: theme.colors.textMuted,
    ...theme.typography.bodySm,
    textAlign: 'center',
  };

  return (
    <View style={[containerStyle, style]}>
      <IconByVariant name={icon} variant="secondary" size="lg" />
      <Text style={[titleTextStyle, titleStyle]}>{title}</Text>
      {description ? (
        <Text style={[descriptionTextStyle, descriptionStyle]}>{description}</Text>
      ) : null}
      {action}
    </View>
  );
};
