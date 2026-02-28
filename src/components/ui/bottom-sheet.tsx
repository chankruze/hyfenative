import { useEffect, useMemo, useRef } from 'react';
import type { ComponentType, ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { useThemeValue } from '@/theme';
import { AppModal } from './modal';

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

type GorhomModule = {
  BottomSheetModalProvider: ComponentType<{ children?: ReactNode }>;
  BottomSheetModal: ComponentType<Record<string, unknown>>;
};

const loadGorhomModule = (): GorhomModule | null => {
  try {
    return require('@gorhom/bottom-sheet') as GorhomModule;
  } catch {
    return null;
  }
};

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
  const gorhom = useMemo(loadGorhomModule, []);
  const sheetRef = useRef<{ present: () => void; dismiss: () => void } | null>(null);

  useEffect(() => {
    if (!gorhom || !sheetRef.current) {
      return;
    }

    if (visible) {
      sheetRef.current.present();
      return;
    }

    sheetRef.current.dismiss();
  }, [gorhom, visible]);

  if (!gorhom) {
    const fallbackModalContentStyle: ViewStyle = {
      justifyContent: 'flex-end',
      paddingHorizontal: 0,
      paddingBottom: 0,
    };
    const fallbackSheetStyle: ViewStyle = {
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      borderTopLeftRadius: theme.radius.lg,
      borderTopRightRadius: theme.radius.lg,
      padding: theme.spacing.md,
      gap: theme.spacing.sm,
    };
    const handleStyle: ViewStyle = {
      backgroundColor: theme.colors.borderStrong,
    };

    return (
      <AppModal
        visible={visible}
        onClose={onClose}
        title={title}
        footer={footer}
        size="full"
        style={style}
        contentStyle={[fallbackModalContentStyle, contentStyle]}
      >
        <View style={[styles.fallbackSheet, fallbackSheetStyle]}>
          <View style={[styles.handle, handleStyle]} />
          {title ? (
            <Text style={[theme.typography.label, { color: theme.colors.text }]}>
              {title}
            </Text>
          ) : null}
          <View>{children}</View>
          {footer}
        </View>
      </AppModal>
    );
  }

  const { BottomSheetModalProvider, BottomSheetModal } = gorhom;
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
    <BottomSheetModalProvider>
      <BottomSheetModal
        ref={sheetRef}
        index={0}
        snapPoints={snapPoints}
        onChange={(index: number) => {
          if (index === -1) {
            onClose();
          }
        }}
        onDismiss={onClose}
        backgroundStyle={backgroundStyle}
        handleIndicatorStyle={handleIndicatorStyle}
        style={style}
      >
        <View style={[styles.sheetContent, sheetContentStyle, contentStyle]}>
          {title ? (
            <Text style={[theme.typography.label, { color: theme.colors.text }]}>
              {title}
            </Text>
          ) : null}
          <View>{children}</View>
          {footer}
        </View>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  fallbackSheet: {
    width: '100%',
    borderTopWidth: 1,
  },
  handle: {
    width: 44,
    height: 5,
    alignSelf: 'center',
    borderRadius: 999,
  },
  sheetContent: {
    flex: 1,
  },
});
