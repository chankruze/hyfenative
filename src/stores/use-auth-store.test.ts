import { STORAGE_KEYS } from '@/lib/storage/keys';

type StoreModule = typeof import('@/stores/use-auth-store');

const mockStateStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};

const mockStorage = {
  getString: jest.fn(),
  remove: jest.fn(),
};

const loadStoreModule = (): StoreModule => {
  jest.resetModules();

  jest.doMock('@/lib/storage', () => ({
    storage: mockStorage,
    zustandMMKVStorage: mockStateStorage,
  }));

  return require('@/stores/use-auth-store') as StoreModule;
};

describe('useAuthStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockStateStorage.getItem.mockReturnValue(null);
    mockStorage.getString.mockReturnValue(null);
  });

  it('starts with null access token when no persisted or legacy token exists', () => {
    const { useAuthStore, getAccessTokenFromStore, selectIsLoggedIn } =
      loadStoreModule();

    expect(getAccessTokenFromStore()).toBeNull();
    expect(selectIsLoggedIn(useAuthStore.getState())).toBe(false);
  });

  it('supports token actions: set, hydrate, and clear', () => {
    const { useAuthStore, getAccessTokenFromStore } = loadStoreModule();

    useAuthStore.getState().setAuthToken('token_set');
    expect(getAccessTokenFromStore()).toBe('token_set');

    useAuthStore.getState().hydrateFromVerifyResponse({ token: 'token_hydrated' });
    expect(getAccessTokenFromStore()).toBe('token_hydrated');

    useAuthStore.getState().clearAuth();
    expect(getAccessTokenFromStore()).toBeNull();
  });

  it('hydrates from legacy auth token and removes old key when persisted store is empty', async () => {
    mockStorage.getString.mockReturnValue('legacy_token');

    const { useAuthStore } = loadStoreModule();
    await useAuthStore.persist.rehydrate();

    expect(useAuthStore.getState().accessToken).toBe('legacy_token');
    expect(mockStorage.remove).toHaveBeenCalledWith(STORAGE_KEYS.AUTH_TOKEN);
  });

  it('keeps persisted auth token and ignores legacy token fallback', async () => {
    mockStateStorage.getItem.mockReturnValue(
      JSON.stringify({
        state: { accessToken: 'persisted_token' },
        version: 1,
      }),
    );
    mockStorage.getString.mockReturnValue('legacy_token');

    const { useAuthStore } = loadStoreModule();
    await useAuthStore.persist.rehydrate();

    expect(useAuthStore.getState().accessToken).toBe('persisted_token');
    expect(mockStorage.remove).not.toHaveBeenCalled();
  });
});
