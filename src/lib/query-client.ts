import { QueryClient } from '@tanstack/react-query';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { STORAGE_KEYS } from './storage/keys';
import { asyncStorage } from './storage';

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      retry: false,
    },
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 60 * 24, // 24 hours (required for persistence)
    },
  },
});

// Set up persistence
export const persister = createAsyncStoragePersister({
  storage: asyncStorage,
  key: STORAGE_KEYS.REACT_QUERY_CACHE, // storage key
});
