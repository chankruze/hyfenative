import { Image, StyleSheet, Text, View } from 'react-native';
import type {
  ImageSourcePropType,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { useThemeValue } from '@/theme';
import type { ComponentSize, ComponentVariant } from '../primitives/shared';
import { avatarSizes, getVariantTokens } from '../primitives/shared';

type AvatarProps = {
  variant?: ComponentVariant;
  size?: ComponentSize;
  source?: ImageSourcePropType;
  name?: string;
  fallback?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

const getInitials = (value?: string) => {
  if (!value) {
    return '?';
  }

  const initials = value
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase())
    .join('');

  return initials || '?';
};

export const Avatar = ({
  variant = 'secondary',
  size = 'md',
  source,
  name,
  fallback,
  style,
  textStyle,
}: AvatarProps) => {
  const theme = useThemeValue();
  const tokens = getVariantTokens(theme, variant);
  const dimension = avatarSizes[size];
  const initials = fallback ?? getInitials(name);
  const containerStyle = {
    width: dimension,
    height: dimension,
    borderRadius: dimension / 2,
    borderColor: tokens.border,
    backgroundColor: tokens.backgroundMuted,
  };
  const imageStyle = { width: dimension, height: dimension };
  const initialsStyle = {
    color:
      variant === 'secondary' || variant === 'ghost'
        ? theme.colors.text
        : tokens.border,
    fontSize: theme.typography.label.fontSize * (dimension / 36),
  };

  return (
    <View style={[styles.container, containerStyle, style]}>
      {source ? (
        <Image source={source} style={imageStyle} />
      ) : (
        <Text style={[theme.typography.label, initialsStyle, textStyle]}>
          {initials}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    overflow: 'hidden',
  },
});
