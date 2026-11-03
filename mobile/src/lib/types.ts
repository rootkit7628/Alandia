export type Province = { id: number; name: string; park_count: number };

export type WikipediaPage = { lang: string; title: string; url: string };

export type Park = {
  id: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  phone: string | null;
  province: { id: number; name: string };
  rating: number | null;
  rating_count: number;
  wikipedia: WikipediaPage | null;
};

export type Comment = { id: number; body: string; created_at: string; author: string };

export type ParkDetail = Park & { comments: Comment[] };

export type ForumPost = Comment;

export type User = { id: number; pseudo: string };

export type Session = { token: string; user: User };
