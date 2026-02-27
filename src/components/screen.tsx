import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import type {
  KeyboardAvoidingViewProps,
  ScrollViewProps,
  StatusBarStyle,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Edge } from 'react-native-safe-area-context';
import { useTheme } from '@/theme';

type ScreenProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  scroll?: boolean;
  keyboardAware?: boolean;
  animated?: boolean;
  edges?: Edge[];
  statusBarStyle?: StatusBarStyle;
  keyboardVerticalOffset?: number;
  scrollProps?: Omit<ScrollViewProps, 'style' | 'contentContainerStyle'>;
  keyboardAvoidingProps?: Omit<
    KeyboardAvoidingViewProps,
    'style' | 'behavior' | 'keyboardVerticalOffset'
  >;
};

export const Screen = ({
  children,
  style,
  scroll = false,
  keyboardAware = false,
  animated = false,
  edges,
  statusBarStyle,
  keyboardVerticalOffset = 0,
  scrollProps,
  keyboardAvoidingProps,
}: ScreenProps) => {
  const { theme } = useTheme();
  const fadeAnim = useRef(new Animated.Value(animated ? 0 : 1)).current;

  useEffect(() => {
    if (!animated) {
      fadeAnim.setValue(1);
      return;
    }

    fadeAnim.setValue(0);
    const animation = Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    });
    animation.start();

    return () => {
      animation.stop();
    };
  }, [animated, fadeAnim]);

  const content = scroll ? (
    <ScrollView
      style={styles.fill}
      contentContainerStyle={[styles.scrollContent]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      {...scrollProps}
    >
      <View style={[styles.fill, style]}>{children}</View>
    </ScrollView>
  ) : (
    <View style={[styles.fill, style]}>{children}</View>
  );

  const wrappedContent = keyboardAware ? (
    <KeyboardAvoidingView
      style={styles.fill}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={keyboardVerticalOffset}
      {...keyboardAvoidingProps}
    >
      {content}
    </KeyboardAvoidingView>
  ) : (
    content
  );

  return (
    <SafeAreaView
      style={[styles.fill, { backgroundColor: theme.colors.background }]}
      edges={edges}
    >
      <StatusBar
        backgroundColor={theme.colors.background}
        barStyle={
          statusBarStyle ?? (theme.isDark ? 'light-content' : 'dark-content')
        }
      />
      {animated ? (
        <Animated.View style={[styles.fill, { opacity: fadeAnim }]}>
          {wrappedContent}
        </Animated.View>
      ) : (
        wrappedContent
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
