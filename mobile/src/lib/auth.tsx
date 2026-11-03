import { createContext, type ReactNode, useCallback, useContext, useEffect, useState } from 'react';

import { api, ApiError } from './api';
import { tokenStorage } from './token-storage';
import type { Session } from './types';

type AuthContextValue = {
  session: Session | null;
  /** False until the saved session has been read from storage. */
  ready: boolean;
  login: (login: string, password: string) => Promise<void>;
  register: (pseudo: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const saved = await tokenStorage.get();
        if (!saved) return;
        const { token } = JSON.parse(saved) as Session;
        // Refresh the pseudo and drop the session if the token is no longer valid.
        const user = await api.me(token);
        setSession({ token, user });
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) await tokenStorage.clear();
      } finally {
        setReady(true);
      }
    })();
  }, []);

  const save = useCallback(async (next: Session) => {
    await tokenStorage.set(JSON.stringify(next));
    setSession(next);
  }, []);

  const value: AuthContextValue = {
    session,
    ready,
    login: async (login, password) => save(await api.login(login, password)),
    register: async (pseudo, email, password) => save(await api.register(pseudo, email, password)),
    logout: async () => {
      await tokenStorage.clear();
      setSession(null);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside <AuthProvider>');
  return value;
}
