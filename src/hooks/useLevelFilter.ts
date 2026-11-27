"use client";

import type { Level } from "@/content/types";

import { useLocalStorage, writeLocalStorage } from "./useLocalStorage";

export type LevelFilter = Level | "all";

export const levelFilterOptions = [
  { value: "all", label: "All" },
  { value: "foundations", label: "Foundations" },
  { value: "core", label: "Core" },
  { value: "advanced", label: "Advanced" },
] as const satisfies readonly { value: LevelFilter; label: string }[];

const KEY = "patternbook:level";
const values = new Set<unknown>(levelFilterOptions.map((option) => option.value));

function isLevelFilter(value: unknown): value is LevelFilter {
  return values.has(value);
}

export function parseLevelFilter(stored: unknown) {
  return isLevelFilter(stored) ? stored : undefined;
}

export function setLevelFilter(level: LevelFilter) {
  writeLocalStorage(KEY, level);
}

export function useLevelFilter() {
  const [level] = useLocalStorage(KEY, parseLevelFilter, "all");
  return level;
}
