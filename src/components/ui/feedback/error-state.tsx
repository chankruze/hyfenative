import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import type { MaterialDesignIconsIconName } from '@react-native-vector-icons/material-design-icons';
import { useThemeValue } from '@/theme';
import { Button } from '../essentials/button';
import { IconByVariant } from '../primitives/icon-by-variant';

type ErrorStateProps = {
  title?: string;
  description?: string;
  icon?: MaterialDesignIconsIconName;
  actionLabel?: string;
  onActionPress?: () => void;
  action?: ReactNode;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  descriptionStyle?: StyleProp<TextStyle>;
};

export const ErrorState = ({
  title = 'Something went wrong',
  description = 'Please try again.',
  icon = 'alert-circle-outline',
  actionLabel,
  onActionPress,
  action,
  style,
  titleStyle,
  descriptionStyle,
}: ErrorStateProps) => {
  const theme = useThemeValue();
  const containerStyle: ViewStyle = {
    borderWidth: 1,
    borderRadius: theme.radius.lg,
    borderColor: theme.colors.error,
    backgroundColor: theme.colors.primaryMuted,
    padding: theme.spacing.lg,
    alignItems: 'center',
    gap: theme.spacing.sm,
  };
  const titleTextStyle: TextStyle = {
    color: theme.colors.error,
    ...theme.typography.h2,
    textAlign: 'center',
  };
  const descriptionTextStyle: TextStyle = {
    color: theme.colors.textMuted,
    ...theme.typography.bodySm,
    textAlign: 'center',
  };
  const actionNode =
    action ??
    (actionLabel && onActionPress ? (
      <Button
        variant="destructive"
        size="sm"
        title={actionLabel}
        onPress={onActionPress}
      />
    ) : null);

  return (
    <View style={[containerStyle, style]}>
      <IconByVariant name={icon} variant="destructive" size="lg" />
      <Text style={[titleTextStyle, titleStyle]}>{title}</Text>
      {description ? (
        <Text style={[descriptionTextStyle, descriptionStyle]}>{description}</Text>
      ) : null}
      {actionNode}
    </View>
  );
};
