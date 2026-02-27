/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { App } from '../src/app';

jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children }: { children: React.ReactNode }) =>
    children,
  DefaultTheme: {
    dark: false,
    colors: {
      primary: '#000000',
      background: '#000000',
      card: '#000000',
      text: '#000000',
      border: '#000000',
      notification: '#000000',
    },
    fonts: {},
  },
  DarkTheme: {
    dark: true,
    colors: {
      primary: '#111111',
      background: '#111111',
      card: '#111111',
      text: '#ffffff',
      border: '#111111',
      notification: '#111111',
    },
    fonts: {},
  },
}));

jest.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: () => {
    const Navigator = ({ children }: { children: React.ReactNode }) => children;
    const Screen = () => null;

    return {
      Navigator,
      Screen,
    };
  },
}));

jest.mock('@tanstack/react-query-persist-client', () => ({
  PersistQueryClientProvider: ({ children }: { children: React.ReactNode }) =>
    children,
}));

jest.mock('@/lib/query-client', () => ({
  queryClient: {},
  persister: {},
}));

jest.mock('@/providers/error-boundary', () => ({
  AppErrorBoundary: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('@/i18n/use-sync-language', () => ({
  useSyncLanguage: jest.fn(),
}));

jest.mock('@/stores/use-language-store', () => ({
  useLanguageHydrated: () => true,
}));

jest.mock('@/theme', () => {
  const theme = {
    id: 'default-dark',
    mode: 'dark',
    brand: 'default',
    isDark: true,
    colors: {
      background: '#0B1220',
      surface: '#111A2D',
      surfaceAlt: '#0E1728',
      text: '#F8FAFC',
      textMuted: '#CBD5E1',
      textInverse: '#0B1220',
      border: '#1E293B',
      borderStrong: '#27344E',
      primary: '#67E8F9',
      primaryMuted: '#123247',
      accent: '#9EEAFA',
      error: '#FCA5A5',
      success: '#86EFAC',
      inputBackground: '#0E1728',
      inputPlaceholder: '#7E8AA8',
      screenOverlay: '#111A2D',
    },
    spacing: { xs: 8, sm: 12, md: 16, lg: 20, xl: 24 },
    typography: {
      kicker: { fontSize: 12, letterSpacing: 1.2, fontWeight: '700' },
      h1: { fontSize: 34, lineHeight: 40, fontWeight: '800' },
      h2: { fontSize: 30, lineHeight: 36, fontWeight: '800' },
      body: { fontSize: 16, lineHeight: 24, fontWeight: '400' },
      bodySm: { fontSize: 14, lineHeight: 20, fontWeight: '400' },
      label: { fontSize: 13, lineHeight: 18, fontWeight: '600' },
      button: { fontSize: 15, lineHeight: 20, fontWeight: '800' },
    },
    radius: { sm: 10, md: 12, lg: 16 },
  };

  return {
    useThemeHydrated: () => true,
    useThemeValue: () => theme,
    useSyncSystemTheme: jest.fn(),
  };
});

jest.mock('@/api/endpoints/auth/use-auth-api', () => ({
  useSendOtp: () => ({
    isPending: false,
    error: null,
    mutateAsync: jest.fn(),
  }),
  useVerifyOtp: () => ({
    isPending: false,
    error: null,
    mutateAsync: jest.fn(),
  }),
}));

test('renders correctly', async () => {
  await ReactTestRenderer.act(async () => {
    ReactTestRenderer.create(<App />);
  });
});
