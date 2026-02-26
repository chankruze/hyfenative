import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { storage, zustandMMKVStorage } from '@/lib/storage';
import { STORAGE_KEYS } from '@/lib/storage/keys';
import { registerStoreResetter } from './store-reset-registry';

interface AuthState {
  accessToken: string | null;
  setAuthToken: (accessToken: string) => void;
  hydrateFromVerifyResponse: (data: { token: string }) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      accessToken: null,
      setAuthToken: accessToken => set({ accessToken }),
      hydrateFromVerifyResponse: ({ token }) => set({ accessToken: token }),
      clearAuth: () => set({ accessToken: null }),
    }),
    {
      name: STORAGE_KEYS.AUTH_STORE,
      version: 1,
      partialize: state => ({
        accessToken: state.accessToken,
      }),
      storage: createJSONStorage(() => zustandMMKVStorage),
      onRehydrateStorage: () => state => {
        if (state?.accessToken) {
          return;
        }

        const legacyToken = storage.getString(STORAGE_KEYS.AUTH_TOKEN);
        if (!legacyToken) {
          return;
        }

        useAuthStore.setState({ accessToken: legacyToken });
        storage.remove(STORAGE_KEYS.AUTH_TOKEN);
      },
    },
  ),
);

export const selectAccessToken = (state: AuthState) => state.accessToken;
export const selectIsLoggedIn = (state: AuthState) => Boolean(state.accessToken);

export const getAccessTokenFromStore = () => useAuthStore.getState().accessToken;
export const clearAuthStore = () => useAuthStore.getState().clearAuth();

registerStoreResetter(clearAuthStore);
