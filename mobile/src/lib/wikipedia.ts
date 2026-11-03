import { useEffect, useState } from 'react';

import type { WikipediaPage } from './types';

export type WikiSummary = { image: string | null; extract: string | null };

type RawSummary = { thumbnail?: { source: string }; extract?: string };

const NOTHING: WikiSummary = { image: null, extract: null };
const cache = new Map<string, Promise<WikiSummary>>();

function fetchSummary(lang: string, title: string): Promise<WikiSummary> {
  const key = `${lang}:${title}`;
  let pending = cache.get(key);
  if (!pending) {
    const slug = encodeURIComponent(title.replace(/ /g, '_'));
    pending = fetch(`https://${lang}.wikipedia.org/api/rest_v1/page/summary/${slug}`)
      .then((res): Promise<RawSummary> => (res.ok ? res.json() : Promise.resolve({})))
      .then((data) => ({
        image: data.thumbnail?.source ?? null,
        extract: data.extract ?? null,
      }))
      .catch(() => {
        cache.delete(key); // retry next time, e.g. once the phone is back online
        return NOTHING;
      });
    cache.set(key, pending);
  }
  return pending;
}

/**
 * Photo and summary of a park's Wikipedia page: `undefined` while loading, nulls when the park
 * has no page or the request fails.
 */
export function useWikiSummary(page: WikipediaPage | null): WikiSummary | undefined {
  const lang = page?.lang;
  const title = page?.title;
  const key = page ? `${lang}:${title}` : null;
  const [result, setResult] = useState<{ key: string; summary: WikiSummary }>();

  useEffect(() => {
    if (!lang || !title) return;
    let active = true;
    fetchSummary(lang, title).then(
      (summary) => active && setResult({ key: `${lang}:${title}`, summary }),
    );
    return () => {
      active = false;
    };
  }, [lang, title]);

  if (!key) return NOTHING;
  return result?.key === key ? result.summary : undefined;
}
