const storeResetters = new Set<() => void>();

export const registerStoreResetter = (resetter: () => void) => {
  storeResetters.add(resetter);

  return () => {
    storeResetters.delete(resetter);
  };
};

export const resetAllStores = () => {
  for (const resetStore of storeResetters) {
    resetStore();
  }
};
