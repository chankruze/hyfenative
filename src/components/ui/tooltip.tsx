import { useRef, useState } from 'react';
import type { ReactNode } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  UIManager,
  View,
  findNodeHandle,
} from 'react-native';
import type { LayoutRectangle, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { useThemeValue } from '@/theme';

type TooltipPlacement = 'top' | 'bottom';

type TooltipProps = {
  children: ReactNode;
  content: ReactNode;
  visible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
  placement?: TooltipPlacement;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

const measureNode = (node: number): Promise<LayoutRectangle> =>
  new Promise(resolve => {
    UIManager.measureInWindow(node, (x, y, width, height) => {
      resolve({ x, y, width, height });
    });
  });

export const Tooltip = ({
  children,
  content,
  visible,
  onVisibleChange,
  placement = 'top',
  disabled = false,
  style,
  textStyle,
}: TooltipProps) => {
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

  const openTooltip = async () => {
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

  const closeTooltip = () => {
    setOpen(false);
  };

  const bubbleStyle = {
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.text,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs / 2,
  };

  const bubbleTextStyle = {
    color: theme.colors.textInverse,
    ...theme.typography.bodySm,
  };

  const bubblePositionStyle = anchor
    ? {
        left: anchor.x,
        top:
          placement === 'top'
            ? anchor.y - theme.spacing.xl * 2
            : anchor.y + anchor.height + theme.spacing.xs,
      }
    : undefined;

  return (
    <>
      <Pressable
        ref={triggerRef}
        onLongPress={openTooltip}
        onPressIn={openTooltip}
        onPressOut={closeTooltip}
        delayLongPress={220}
        style={style}
      >
        {children}
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={closeTooltip}
      >
        <Pressable style={styles.overlay} onPress={closeTooltip}>
          <View style={[styles.bubble, bubblePositionStyle, bubbleStyle]}>
            {typeof content === 'string' ? (
              <Text style={[bubbleTextStyle, textStyle]}>{content}</Text>
            ) : (
              content
            )}
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
  bubble: {
    position: 'absolute',
    maxWidth: '90%',
  },
});
