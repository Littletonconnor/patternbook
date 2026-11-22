"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

export type Parse<T> = (stored: unknown) => T | undefined;

const CHANGE = "patternbook:storage-change";

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE, onChange);
  };
}

function readRaw(key: string) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function decodeStored<T>(raw: string | null, parse: Parse<T>) {
  if (raw === null) {
    return undefined;
  }
  try {
    return parse(JSON.parse(raw));
  } catch {
    return parse(raw);
  }
}

export function readLocalStorage<T>(key: string, parse: Parse<T>, fallback: T): T {
  return decodeStored(readRaw(key), parse) ?? fallback;
}

export function writeLocalStorage<T>(key: string, value: T) {
  let saved = true;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    saved = false;
  }
  window.dispatchEvent(new Event(CHANGE));
  return saved;
}

export function useLocalStorage<T>(key: string, parse: Parse<T>, fallback: T) {
  const raw = useSyncExternalStore(
    subscribe,
    () => readRaw(key),
    () => null,
  );
  const value = useMemo(() => decodeStored(raw, parse) ?? fallback, [raw, parse, fallback]);
  const setValue = useCallback((next: T) => writeLocalStorage(key, next), [key]);
  return [value, setValue] as const;
}
