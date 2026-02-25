import type { ReactotronReactNative } from 'reactotron-react-native';
import Reactotron from 'reactotron-react-native';
import mmkvPlugin from 'reactotron-react-native-mmkv';
import config from '../../app.json';
import { storage } from '@/lib/storage';
import { queryClient } from '@/lib/query-client';

declare global {
  interface Console {
    tron: typeof reactotron;
  }
}

const reactotron = Reactotron.configure({ name: config.name })
  .useReactNative()
  .use(mmkvPlugin<ReactotronReactNative>({ storage }))
  .connect();

if (__DEV__) {
  console.tron = reactotron;

  // Log all TanStack Query changes
  queryClient.getQueryCache().subscribe(event => {
    console.tron?.log?.('Query event:', event);
  });
}
