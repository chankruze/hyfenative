import type { ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import type { DimensionValue, StyleProp, ViewStyle } from 'react-native';
import { useThemeValue } from '@/theme';

type AppModalSize = 'sm' | 'md' | 'lg' | 'full';

type AppModalProps = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children?: ReactNode;
  footer?: ReactNode;
  dismissible?: boolean;
  size?: AppModalSize;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
};

const widthBySize: Record<Exclude<AppModalSize, 'full'>, string> = {
  sm: '82%',
  md: '90%',
  lg: '96%',
};

export const AppModal = ({
  visible,
  onClose,
  title,
  children,
  footer,
  dismissible = true,
  size = 'md',
  style,
  contentStyle,
}: AppModalProps) => {
  const theme = useThemeValue();
  const backdropStyle = {
    backgroundColor: theme.backdrop.strong,
  };
  const panelStyle: ViewStyle = {
    width: (size === 'full' ? '100%' : widthBySize[size]) as DimensionValue,
    maxHeight: (size === 'full' ? '100%' : '88%') as DimensionValue,
    borderRadius: size === 'full' ? 0 : theme.radius.lg,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
    ...theme.elevation.lg,
  };
  const titleStyle = {
    color: theme.colors.text,
    ...theme.typography.h2,
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        style={[styles.backdrop, backdropStyle, style]}
        onPress={dismissible ? onClose : undefined}
      >
        <Pressable style={[styles.panel, panelStyle, contentStyle]} onPress={() => {}}>
          {title ? <Text style={titleStyle}>{title}</Text> : null}
          <View style={styles.content}>{children}</View>
          {footer}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  panel: {
    borderWidth: 1,
  },
  content: {
    width: '100%',
  },
});
