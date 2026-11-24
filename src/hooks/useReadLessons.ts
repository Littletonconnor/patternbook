"use client";

import { useCallback, useMemo } from "react";

import { isLessonSlug } from "@/content/catalog";
import type { LessonSlug } from "@/content/catalog";
import { isArray } from "@/lib/isArray";

import { readLocalStorage, useLocalStorage, writeLocalStorage } from "./useLocalStorage";

const KEY = "patternbook:read";
const none: LessonSlug[] = [];

function parseSlugs(stored: unknown) {
  return isArray(stored)
    ? stored.filter((slug): slug is LessonSlug => typeof slug === "string" && isLessonSlug(slug))
    : undefined;
}

export function useReadLessons() {
  const [slugs] = useLocalStorage(KEY, parseSlugs, none);
  const read = useMemo(() => new Set(slugs), [slugs]);

  const setRead = useCallback((slug: LessonSlug, isRead: boolean) => {
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
