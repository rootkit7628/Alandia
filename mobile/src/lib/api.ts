import Constants from 'expo-constants';

import type { Comment, ForumPost, Park, ParkDetail, Province, Session } from './types';

/**
 * The API address comes from EXPO_PUBLIC_API_URL. Without it, in development, we reuse the
 * address of the machine running `expo start`, so a phone running Expo Go on the same Wi-Fi
 * reaches the Flask server without any setup.
 */
function resolveApiUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, '');
  const host = Constants.expoConfig?.hostUri?.split(':')[0];
  return `http://${host ?? 'localhost'}:5000`;
}

export const API_URL = resolveApiUrl();

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

async function request<T>(
  path: string,
  { method = 'GET', body, token }: { method?: string; body?: unknown; token?: string } = {},
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}/api${path}`, {
      method,
      headers: {
        Accept: 'application/json',
        ...(body !== undefined && { 'Content-Type': 'application/json' }),
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(`Serveur injoignable (${API_URL}).`, 0);
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError(data.error ?? `Erreur ${response.status}`, response.status);
  }
  return data as T;
}

export const api = {
  provinces: () => request<{ provinces: Province[] }>('/provinces').then((d) => d.provinces),

  parks: (params: { q?: string; province?: number | null } = {}) => {
    const query = new URLSearchParams();
    if (params.q) query.set('q', params.q);
    if (params.province) query.set('province', String(params.province));
    const suffix = query.toString() ? `?${query}` : '';
    return request<{ parks: Park[] }>(`/parks${suffix}`).then((d) => d.parks);
  },

  park: (id: number) => request<{ park: ParkDetail }>(`/parks/${id}`).then((d) => d.park),

  myRating: (id: number, token: string) =>
    request<{ score: number | null }>(`/parks/${id}/my-rating`, { token }).then((d) => d.score),

  rate: (id: number, score: number, token: string) =>
    request<{ score: number; rating: number; rating_count: number }>(`/parks/${id}/rating`, {
      method: 'PUT',
      body: { score },
      token,
    }),

  comment: (id: number, body: string, token: string) =>
    request<{ comment: Comment }>(`/parks/${id}/comments`, {
      method: 'POST',
      body: { body },
      token,
    }).then((d) => d.comment),

  forum: () => request<{ posts: ForumPost[] }>('/forum').then((d) => d.posts),

  post: (body: string, token: string) =>
    request<{ post: ForumPost }>('/forum', { method: 'POST', body: { body }, token }).then(
      (d) => d.post,
    ),

  register: (pseudo: string, email: string, password: string) =>
    request<Session>('/auth/register', { method: 'POST', body: { pseudo, email, password } }),

  login: (login: string, password: string) =>
    request<Session>('/auth/login', { method: 'POST', body: { login, password } }),

  me: (token: string) => request<Pick<Session, 'user'>>('/auth/me', { token }).then((d) => d.user),
};
