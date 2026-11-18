import { useSyncExternalStore } from "react";

import { SIDEBAR, SIDEBAR_KEY as KEY } from "./sidebarScript";

export { SIDEBAR };

type Stored = { width: number; collapsed: boolean };

function read(): Stored {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? "null");
    if (raw && typeof raw.width === "number") {
      return { width: clampWidth(raw.width), collapsed: raw.collapsed === true };
    }
  } catch {}
  return { width: SIDEBAR.initial, collapsed: false };
}

function write(state: Stored) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {}
}

export function clampWidth(width: number) {
  return Math.min(SIDEBAR.max, Math.max(SIDEBAR.min, Math.round(width)));
}

export function previewWidth(width: number) {
  const root = document.documentElement;
  root.style.setProperty("--sidebar-track", `${width}px`);
  if (width > 0) root.style.setProperty("--sidebar-width", `${width}px`);
}

function apply(state: Stored) {
  const root = document.documentElement;
  root.style.setProperty("--sidebar-width", `${state.width}px`);
  root.style.setProperty("--sidebar-track", state.collapsed ? "0px" : `${state.width}px`);
  root.dataset.sidebar = state.collapsed ? "collapsed" : "open";
  listeners.forEach((listener) => listener());
}

export function commitSidebar(next: Partial<Stored>) {
  const state = { ...read(), ...next };
  state.width = clampWidth(state.width);
  write(state);
  apply(state);
}

export function getSidebarWidth() {
  return read().width;
}

export function toggleSidebar() {
  commitSidebar({ collapsed: !isCollapsed() });
}

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function isCollapsed() {
  return document.documentElement.dataset.sidebar === "collapsed";
}

export function useSidebarCollapsed() {
  return useSyncExternalStore(subscribe, isCollapsed, () => false);
}

export function useSidebarWidth() {
  return useSyncExternalStore(subscribe, getSidebarWidth, () => SIDEBAR.initial);
}
