export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER: 'user',
  AUTH_STORE: 'auth-store',
  REACT_QUERY_CACHE: 'TANSTACK_QUERY_CACHE',
} as const;

// usage
// storage.set(STORAGE_KEYS.AUTH_TOKEN, token);
