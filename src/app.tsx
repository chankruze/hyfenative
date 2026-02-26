import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from '@/navigation/root-navigator';
import { queryClient, persister } from '@/lib/query-client';
import { AppErrorBoundary } from '@/providers/app-error-boundary';

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#0B1220',
  },
};

export const App = () => {
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
