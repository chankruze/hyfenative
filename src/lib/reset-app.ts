import { resetAllStores } from '@/stores/store-reset-registry';
import { queryClient, persister } from './query-client';
import { asyncStorage } from './storage/mmkv-async';
import { STORAGE_KEYS } from './storage/keys';

export const resetAppState = async () => {
  await queryClient.cancelQueries();

  queryClient.clear();

  await persister.removeClient();
  await asyncStorage.removeItem(STORAGE_KEYS.REACT_QUERY_CACHE);

  resetAllStores();
};
