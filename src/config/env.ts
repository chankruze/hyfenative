import Config from 'react-native-config';

console.log('ENV DEBUG →', Config);

export const env = {
  apiProtocol: Config.API_PROTOCOL,
  apiHost: Config.API_HOST,
  apiVersion: Config.API_VERSION,
  apiUrl: Config.API_URL,
  appEnv: Config.APP_ENV,
};
