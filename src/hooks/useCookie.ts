"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

import { decodeStored } from "./useLocalStorage";
import type { Parse } from "./useLocalStorage";

const CHANGE = "patternbook:cookie-change";
const YEAR_SECONDS = 60 * 60 * 24 * 365;

type CookieOptions = { maxAgeSeconds?: number };

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE, onChange);
  return () => window.removeEventListener(CHANGE, onChange);
}

function readRaw(key: string) {
  const prefix = `${encodeURIComponent(key)}=`;
  const entry = document.cookie.split("; ").find((part) => part.startsWith(prefix));
  return entry === undefined ? null : decodeURIComponent(entry.slice(prefix.length));
}

export function writeCookie<T>(key: string, value: T, options: CookieOptions = {}) {
  const maxAge = options.maxAgeSeconds ?? YEAR_SECONDS;
  const encoded = encodeURIComponent(JSON.stringify(value));
  document.cookie = `${encodeURIComponent(key)}=${encoded}; path=/; max-age=${maxAge}; samesite=lax`;
  window.dispatchEvent(new Event(CHANGE));
}

export function useCookie<T>(key: string, parse: Parse<T>, fallback: T) {
  const raw = useSyncExternalStore(
    subscribe,
    () => readRaw(key),
    () => null,
  );
  const value = useMemo(() => decodeStored(raw, parse) ?? fallback, [raw, parse, fallback]);
  const setValue = useCallback(
    (next: T, options?: CookieOptions) => writeCookie(key, next, options),
    [key],
  );
  return [value, setValue] as const;
}
