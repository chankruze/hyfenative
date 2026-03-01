export type HyfenativeConfig = {
  app: {
    name: string;
    slug: string;
    scheme: string;
    version: string; // semantic version
    buildNumber: number; // iOS build
    versionCode: number; // Android
  };
  android: {
    package: string;
  };
  ios: {
    bundleId: string;
  };
  assets: {
    icon: string; // base 1024x1024 PNG
    adaptiveIcon?: string; // optional Android foreground
  };
};

export const config: HyfenativeConfig = {
  app: {
    name: 'Hyfenative',
    slug: 'hyfenative',
    scheme: 'hyfenative',
    version: '0.0.1',
    buildNumber: 1,
    versionCode: 1,
  },
  android: {
    package: 'com.hyfenative',
  },
  ios: {
    bundleId: 'com.hyfenative',
  },
  assets: {
    icon: './assets/app-icon.png',
  },
};
