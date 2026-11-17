"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

const KEY = "patternbook:read";
const EVENT = "patternbook:read-change";

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(EVENT, onChange);
  };
}

function getSnapshot() {
  try {
    return window.localStorage.getItem(KEY) ?? "[]";
  } catch {
    return "[]";
  }
}

function getServerSnapshot() {
  return "[]";
}

function parse(raw: string): string[] {
  try {
    const value: unknown = JSON.parse(raw);
    return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];
  } catch {
    return [];
  }
}

export function useReadLessons() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const read = useMemo(() => new Set(parse(raw)), [raw]);

  const setRead = useCallback((slug: string, isRead: boolean) => {
    const next = new Set(parse(getSnapshot()));
    if (isRead) next.add(slug);
    else next.delete(slug);
    try {
      window.localStorage.setItem(KEY, JSON.stringify([...next]));
    } catch {
      // storage blocked: the tick just won't persist
    }
    window.dispatchEvent(new Event(EVENT));
  }, []);

  return { read, setRead };
}
