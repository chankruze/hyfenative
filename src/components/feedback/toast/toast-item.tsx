import { memo, useCallback, useEffect, useRef } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import type { TextStyle, ViewStyle } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useThemeValue } from '@/theme';
import type { Toast } from './toast-store';

type Props = {
  toast: Toast;
  onRemove: (id: string) => void;
};

const ENTER_DURATION = 220;
const EXIT_DURATION = 180;
const DEFAULT_DURATION = 3200;

const ToastItemComponent = ({ toast, onRemove }: Props) => {
  const theme = useThemeValue();
  const translateY = useSharedValue(40);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.98);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const removeWithAnimation = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    translateY.value = withTiming(30, { duration: EXIT_DURATION });
    opacity.value = withTiming(0, { duration: EXIT_DURATION }, finished => {
      if (finished) {
        runOnJS(onRemove)(toast.id);
      }
    });
  }, [onRemove, opacity, toast.id, translateY]);

  useEffect(() => {
    translateY.value = withTiming(0, { duration: ENTER_DURATION });
    opacity.value = withTiming(1, { duration: ENTER_DURATION });
    scale.value = withTiming(1, { duration: ENTER_DURATION });

    timeoutRef.current = setTimeout(() => {
      removeWithAnimation();
    }, toast.duration ?? DEFAULT_DURATION);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [opacity, removeWithAnimation, scale, toast.duration, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
    opacity: opacity.value,
  }));

  const isInfo = (toast.type ?? 'info') === 'info';
  const isSnackbar = (toast.variant ?? 'toast') === 'snackbar';

  const containerStyle: ViewStyle = {
    borderWidth: isInfo ? 1 : 0,
    borderColor: isInfo ? theme.colors.border : 'transparent',
    backgroundColor:
      toast.type === 'success'
        ? theme.colors.success
        : toast.type === 'error'
          ? theme.colors.error
          : theme.colors.surface,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
    minHeight: isSnackbar ? 52 : 48,
  };

  const messageStyle: TextStyle = {
    flex: 1,
    color: isInfo ? theme.colors.text : theme.colors.textInverse,
    ...theme.typography.bodySm,
  };

  const actionStyle: TextStyle = {
    color: isInfo ? theme.colors.primary : theme.colors.textInverse,
    ...theme.typography.label,
  };

  return (
    <Animated.View style={[containerStyle, animatedStyle]}>
      <Text style={messageStyle}>{toast.message}</Text>

      {toast.actionLabel && toast.onAction ? (
        <Pressable
          onPress={() => {
            toast.onAction?.();
            removeWithAnimation();
          }}
          style={({ pressed }) => [pressed && { opacity: theme.state.pressedOpacity }]}
        >
          <Text style={actionStyle}>{toast.actionLabel}</Text>
        </Pressable>
      ) : null}

      <Pressable
        onPress={removeWithAnimation}
        accessibilityRole="button"
        style={({ pressed }) => [
          styles.dismiss,
          pressed && { opacity: theme.state.pressedOpacity },
        ]}
      >
        <Text style={actionStyle}>×</Text>
      </Pressable>
    </Animated.View>
  );
};

export const ToastItem = memo(ToastItemComponent);

const styles = StyleSheet.create({
  dismiss: {
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
