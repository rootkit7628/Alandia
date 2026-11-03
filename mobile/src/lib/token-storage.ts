import * as SecureStore from 'expo-secure-store';

const KEY = 'alandia.session';

export const tokenStorage = {
  get: () => SecureStore.getItemAsync(KEY),
  set: (value: string) => SecureStore.setItemAsync(KEY, value),
  clear: () => SecureStore.deleteItemAsync(KEY),
};
