import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from '@/navigation/root-navigator';
import { queryClient, persister } from '@/lib/query-client';
import { AppErrorBoundary } from '@/providers/error-boundary';
import { useTheme, useThemeHydrated } from '@/theme';

export const App = () => {
  const hasHydrated = useThemeHydrated();
  const { theme } = useTheme();

  if (!hasHydrated) {
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
          <NavigationContainer theme={navigationTheme}>
            <RootNavigator />
          </NavigationContainer>
        </SafeAreaProvider>
      </AppErrorBoundary>
    </PersistQueryClientProvider>
  );
};
