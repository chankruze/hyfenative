import { View } from 'react-native';
import type { ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useShallow } from 'zustand/react/shallow';
import { useThemeValue } from '@/theme';
import { useToastStore } from './toast-store';
import { ToastItem } from './toast-item';

export const ToastContainer = () => {
  const theme = useThemeValue();
  const insets = useSafeAreaInsets();
  const { toasts, remove } = useToastStore(
    useShallow(state => ({
      toasts: state.toasts,
      remove: state.remove,
    })),
  );

  if (!toasts.length) {
    return null;
  }

  const wrapperStyle: ViewStyle = {
    position: 'absolute',
    left: theme.spacing.md,
    right: theme.spacing.md,
    bottom: Math.max(insets.bottom, theme.spacing.md),
  };

  return (
    <View pointerEvents="box-none" style={wrapperStyle}>
      {toasts.map(item => (
        <ToastItem key={item.id} toast={item} onRemove={remove} />
      ))}
    </View>
  );
};
