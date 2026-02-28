export type HyfenativeConfig = {
  app: {
    name: string;
    slug: string;
    scheme: string;
  };
  android: {
    package: string;
  };
  ios: {
    bundleId: string;
  };
};

const config: HyfenativeConfig = {
  app: {
    name: 'Hyfenative',
    slug: 'hyfenative',
    scheme: 'hyfenative',
  },
  android: {
    package: 'com.hyfenative',
  },
  ios: {
    bundleId: 'com.hyfenative',
  },
};

export default config;
