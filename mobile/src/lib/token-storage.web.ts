// SecureStore does not exist on the web: the browser's localStorage takes its place.
const KEY = 'alandia.session';

export const tokenStorage = {
  get: async () => globalThis.localStorage?.getItem(KEY) ?? null,
  set: async (value: string) => globalThis.localStorage?.setItem(KEY, value),
  clear: async () => globalThis.localStorage?.removeItem(KEY),
};
