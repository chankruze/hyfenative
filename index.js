/**
 * @format
 */

import 'react-native-gesture-handler';
import 'react-native-reanimated';
import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import { App } from '@/app';
import { setErrorReporter } from '@/lib/error/reporting';

if (__DEV__) {
  require('./src/devtools/reactotron');
}

setErrorReporter((error, context) => {
  if (__DEV__) {
    console.error('[GlobalErrorReporter]', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      context,
    });
    return;
  }

  // TODO: wire Sentry here.
  // Sentry.captureException(error, { extra: context });
  console.error('[GlobalErrorReporter]', {
    name: error.name,
    message: error.message,
    context,
  });
});

AppRegistry.registerComponent(appName, () => App);
