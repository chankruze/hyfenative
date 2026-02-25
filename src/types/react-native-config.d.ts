declare module 'react-native-config' {
  export interface NativeConfig {
    API_PROTOCOL: string;
    API_HOST: string;
    API_VERSION: string;
    API_URL: string;
    APP_ENV: string;
  }

  export const Config: NativeConfig;
  export default Config;
}
