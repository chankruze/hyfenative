import { createMMKV } from 'react-native-mmkv';

export const storage = createMMKV({
  id: 'hyfenative-storage',
});

// export const storage = createMMKV({
//   id: `user-${userId}-storage`,
//   path: `${USER_DIRECTORY}/storage`,
//   encryptionKey: 'hunter2',
//   mode: 'multi-process',
//   readOnly: false,
// });