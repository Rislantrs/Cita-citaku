import { useEffect, useState, useCallback, useRef } from 'react';

const STORAGE_PREFIX = 'cita-citaku:';

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch {
    /* quota exceeded or storage unavailable — silently ignore */
  }
}

export function usePersistedState<T>(
  key: string,
  initialValue: T
): [T, (next: T | ((prev: T) => T)) => void, () => void] {
  const [state, setState] = useState<T>(() => readStorage(key, initialValue));
  const keyRef = useRef(key);

  useEffect(() => {
    keyRef.current = key;
  }, [key]);

  useEffect(() => {
    writeStorage(keyRef.current, state);
  }, [state]);

  const clear = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_PREFIX + keyRef.current);
    }
    setState(initialValue);
    // initialValue is intentionally captured at first render — keeps API stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [state, setState, clear];
}

export function clearPersistedKey(key: string) {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(STORAGE_PREFIX + key);
}
