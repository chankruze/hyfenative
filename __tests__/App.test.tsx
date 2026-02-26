/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../src/app';

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

jest.mock('@/api/hooks/use-auth-api', () => ({
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
