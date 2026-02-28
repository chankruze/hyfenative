import type { ReactNode } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import type {
  ImageResizeMode,
  ImageSourcePropType,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { useThemeValue } from '@/theme';
import type { ComponentSize, ComponentVariant } from './shared';
import { assetSizes, getVariantTokens } from './shared';

type VariantAssetMap = Partial<Record<ComponentVariant, ImageSourcePropType>>;
type VariantContentMap = Partial<Record<ComponentVariant, ReactNode>>;

type AssetByVariantProps = {
  variant?: ComponentVariant;
  size?: ComponentSize;
  assets?: VariantAssetMap;
  content?: VariantContentMap;
  resizeMode?: ImageResizeMode;
  style?: StyleProp<ViewStyle>;
};

export const AssetByVariant = ({
  variant = 'primary',
  size = 'md',
  assets,
  content,
  resizeMode = 'contain',
  style,
}: AssetByVariantProps) => {
  const theme = useThemeValue();
  const tokens = getVariantTokens(theme, variant);
  const assetSource = assets?.[variant] ?? assets?.secondary ?? assets?.primary;
  const mappedContent =
    content?.[variant] ?? content?.secondary ?? content?.primary;
  const dimension = assetSizes[size];
  const containerStyle = {
    width: dimension,
    height: dimension,
    borderRadius: theme.radius.sm,
    backgroundColor: tokens.backgroundMuted,
  };
  const imageStyle = { width: dimension * 0.8, height: dimension * 0.8 };

  return (
    <View style={[styles.container, containerStyle, style]}>
      {assetSource ? (
        <Image
          source={assetSource}
          resizeMode={resizeMode}
          style={imageStyle}
        />
      ) : (
        mappedContent
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
