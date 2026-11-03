import { useCallback, useEffect, useState } from 'react';

type AsyncState<T> = {
  /** The last loaded value, kept while a reload is in flight. */
  data: T | undefined;
  error: Error | undefined;
  loading: boolean;
  reload: () => void;
  setData: (update: (current: T | undefined) => T | undefined) => void;
};

/**
 * Runs `load` whenever `deps` change (they must be JSON-serialisable, e.g. ids and strings).
 * Results from an outdated call are ignored.
 */
export function useAsync<T>(load: () => Promise<T>, deps: readonly unknown[]): AsyncState<T> {
  const [version, setVersion] = useState(0);
  const key = JSON.stringify([deps, version]);
  const [data, setData] = useState<T>();
  const [settled, setSettled] = useState<{ key: string; error?: Error }>();

  useEffect(() => {
    let active = true;
    load().then(
      (value) => {
        if (!active) return;
        setData(value);
        setSettled({ key });
      },
      (error: Error) => active && setSettled({ key, error }),
    );
    return () => {
      active = false;
    };
    // `key` already encodes `deps`, the only inputs `load` may depend on.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const done = settled?.key === key;
  return {
    data,
    error: done ? settled.error : undefined,
    loading: !done,
    reload: useCallback(() => setVersion((v) => v + 1), []),
    setData,
  };
}
