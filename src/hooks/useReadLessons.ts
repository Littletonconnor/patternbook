"use client";

import { useCallback, useMemo } from "react";
import { readLocalStorage, useLocalStorage, writeLocalStorage } from "./useLocalStorage";

const KEY = "patternbook:read";
const none: string[] = [];

function parseSlugs(stored: unknown) {
  return Array.isArray(stored)
    ? stored.filter((slug): slug is string => typeof slug === "string")
    : undefined;
}

export function useReadLessons() {
  const [slugs] = useLocalStorage(KEY, parseSlugs, none);
  const read = useMemo(() => new Set(slugs), [slugs]);

  const setRead = useCallback((slug: string, isRead: boolean) => {
    const next = new Set(readLocalStorage(KEY, parseSlugs, none));
    if (isRead) {
      next.add(slug);
    } else {
      next.delete(slug);
    }
    writeLocalStorage(KEY, [...next]);
  }, []);

  return { read, setRead };
}
