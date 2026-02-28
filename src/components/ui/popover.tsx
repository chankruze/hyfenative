import { useRef, useState } from 'react';
import type { ReactNode } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  UIManager,
  View,
  findNodeHandle,
} from 'react-native';
import type { LayoutRectangle, StyleProp, ViewStyle } from 'react-native';
import { useThemeValue } from '@/theme';

type PopoverPlacement = 'top' | 'bottom';

type PopoverProps = {
  trigger: ReactNode;
  content: ReactNode;
  visible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
  placement?: PopoverPlacement;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
};

const measureNode = (node: number): Promise<LayoutRectangle> =>
  new Promise(resolve => {
    UIManager.measureInWindow(node, (x, y, width, height) => {
      resolve({ x, y, width, height });
    });
  });

export const Popover = ({
  trigger,
  content,
  visible,
  onVisibleChange,
  placement = 'bottom',
  disabled = false,
  style,
  contentStyle,
}: PopoverProps) => {
  const theme = useThemeValue();
  const triggerRef = useRef<View | null>(null);
  const [internalVisible, setInternalVisible] = useState(false);
  const [anchor, setAnchor] = useState<LayoutRectangle | null>(null);

  const open = visible ?? internalVisible;

  const setOpen = (next: boolean) => {
    onVisibleChange?.(next);
    if (visible === undefined) {
      setInternalVisible(next);
    }
  };

  const openPopover = async () => {
    if (disabled) {
      return;
    }

    const node = findNodeHandle(triggerRef.current);
    if (!node) {
      return;
    }

    const rect = await measureNode(node);
    setAnchor(rect);
    setOpen(true);
  };

  const closePopover = () => {
    setOpen(false);
  };

  const containerStyle = {
    borderWidth: 1,
    borderRadius: theme.radius.md,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.sm,
    ...theme.elevation.md,
  };

  const popoverPositionStyle = anchor
    ? {
        left: anchor.x,
        top:
          placement === 'top'
            ? anchor.y - theme.spacing.xl * 3
            : anchor.y + anchor.height + theme.spacing.xs,
      }
    : undefined;

  return (
    <>
      <Pressable ref={triggerRef} onPress={openPopover} style={style}>
        {trigger}
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={closePopover}
      >
        <Pressable style={styles.overlay} onPress={closePopover}>
          <View style={[styles.content, popoverPositionStyle, containerStyle, contentStyle]}>
            {content}
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  content: {
    position: 'absolute',
    minWidth: 180,
    maxWidth: '90%',
  },
});
