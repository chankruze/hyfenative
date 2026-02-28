import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from '@react-navigation/native';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ToastProvider } from '@/components';
import { RootNavigator } from '@/navigation/root-navigator';
import { queryClient, persister } from '@/lib/query-client';
import { AppErrorBoundary } from '@/providers/error-boundary';
import { useThemeHydrated, useThemeValue, useSyncSystemTheme } from '@/theme';
import { useSyncLanguage } from '@/i18n/use-sync-language';
import { useLanguageHydrated } from '@/stores/use-language-store';
import '@/i18n';

export const App = () => {
  useSyncSystemTheme();
  useSyncLanguage();

  const hasThemeHydrated = useThemeHydrated();
  const hasLanguageHydrated = useLanguageHydrated();
  const theme = useThemeValue();

  if (!hasThemeHydrated || !hasLanguageHydrated) {
    return null;
  }

  const navigationTheme = {
    ...(theme.isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(theme.isDark ? DarkTheme.colors : DefaultTheme.colors),
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.text,
      border: theme.colors.border,
      notification: theme.colors.accent,
    },
  };

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      <AppErrorBoundary>
        <SafeAreaProvider>
          <GestureHandlerRootView style={styles.fill}>
            <BottomSheetModalProvider>
              <ToastProvider>
                <NavigationContainer theme={navigationTheme}>
                  <RootNavigator />
                </NavigationContainer>
              </ToastProvider>
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </SafeAreaProvider>
      </AppErrorBoundary>
    </PersistQueryClientProvider>
  );
};

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
});
