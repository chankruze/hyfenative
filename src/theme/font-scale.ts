import { PixelRatio } from 'react-native';
import type { ThemeFontScalePreference } from './types';

const APP_SCALE_MAP: Record<Exclude<ThemeFontScalePreference, 'system'>, number> = {
  small: 0.9,
  medium: 1,
  large: 1.15,
};

export const resolveFontScale = (
  mode: ThemeFontScalePreference,
  systemFontScale = PixelRatio.getFontScale(),
): number => {
  if (mode === 'system') {
    return systemFontScale;
  }

  return APP_SCALE_MAP[mode];
};
