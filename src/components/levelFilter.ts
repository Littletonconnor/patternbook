"use client";

import { useSyncExternalStore } from "react";
import type { Level } from "@/content/types";

export type LevelFilter = Level | "all";

export const levelFilterOptions = [
  { value: "all", label: "All" },
  { value: "foundations", label: "Foundations" },
  { value: "core", label: "Core" },
  { value: "advanced", label: "Advanced" },
] as const satisfies readonly { value: LevelFilter; label: string }[];

const KEY = "patternbook:level";
const EVENT = "patternbook:level-change";
const values = new Set<string>(levelFilterOptions.map((o) => o.value));

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(EVENT, onChange);
  };
}

function getSnapshot(): LevelFilter {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw && values.has(raw)) return raw as LevelFilter;
  } catch {}
  return "all";
}

function getServerSnapshot(): LevelFilter {
  return "all";
}

export function setLevelFilter(level: LevelFilter) {
  try {
    window.localStorage.setItem(KEY, level);
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

export function useLevelFilter() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
