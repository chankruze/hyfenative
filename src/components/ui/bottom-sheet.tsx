import { useCallback, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { BottomSheetBackdrop, BottomSheetModal, type BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import { BottomSheetView } from '@gorhom/bottom-sheet';
import { useThemeValue } from '@/theme';

type SnapPoint = number | string;

type BottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children?: ReactNode;
  footer?: ReactNode;
  snapPoints?: SnapPoint[];
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
};

const renderBackdrop = (props: BottomSheetBackdropProps) => (
  <BottomSheetBackdrop
    {...props}
    appearsOnIndex={0}
    disappearsOnIndex={-1}
    pressBehavior="close"
    opacity={0.45}
  />
);

export const BottomSheet = ({
  visible,
  onClose,
  title,
  children,
  footer,
  snapPoints = ['45%', '75%'],
  style,
  contentStyle,
}: BottomSheetProps) => {
  const theme = useThemeValue();
  const sheetRef = useRef<BottomSheetModal>(null);
  const hasPresentedRef = useRef(false);

  const present = useCallback(() => {
    requestAnimationFrame(() => {
      sheetRef.current?.present();
      hasPresentedRef.current = true;
    });
  }, []);

  const dismiss = useCallback(() => {
    sheetRef.current?.dismiss();
    hasPresentedRef.current = false;
  }, []);

  useEffect(() => {
    if (visible) {
      present();
      return;
    }

    if (hasPresentedRef.current) {
      dismiss();
    }
  }, [dismiss, present, visible]);

  const backgroundStyle: ViewStyle = {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
  };
  const handleIndicatorStyle: ViewStyle = {
    backgroundColor: theme.colors.borderStrong,
  };
  const sheetContentStyle: ViewStyle = {
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  };

  return (
    <BottomSheetModal
      ref={sheetRef}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose
      onDismiss={onClose}
      backgroundStyle={backgroundStyle}
      handleIndicatorStyle={handleIndicatorStyle}
      backdropComponent={renderBackdrop}
      style={style}
    >
      <BottomSheetView style={[styles.sheetContent, sheetContentStyle, contentStyle]}>
        {title ? (
          <Text style={[theme.typography.label, { color: theme.colors.text }]}>
            {title}
          </Text>
        ) : null}
        <View>{children}</View>
        {footer}
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  sheetContent: {
    flex: 1,
  },
});
