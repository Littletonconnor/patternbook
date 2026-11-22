"use client";

import * as stylex from "@stylexjs/stylex";
import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent, ReactNode } from "react";
import { colors, motion } from "@/tokens/tokens.stylex";
import {
  SIDEBAR,
  clampWidth,
  commitSidebar,
  getSidebarWidth,
  previewWidth,
  toggleSidebar,
  useSidebarCollapsed,
  useSidebarWidth,
} from "@/hooks/useSidebar";

const WIDE = "@media (min-width: 768px)";
const REDUCED = "@media (prefers-reduced-motion: reduce)";
const TOP_BAR = "57px";
const INITIAL = "264px";
const TRACK = `var(--sidebar-track, ${INITIAL})`;
const KEY_STEP = 16;

const styles = stylex.create({
  columns: {
    display: "grid",
    flexGrow: 1,
    gridTemplateColumns: {
      [WIDE]: `${TRACK} minmax(0, 1fr)`,
      default: "minmax(0, 1fr)",
    },
    transitionDuration: { [REDUCED]: "0s", default: motion.move },
    transitionProperty: "grid-template-columns",
    transitionTimingFunction: motion.easeOut,
  },
  dragging: { cursor: "col-resize", transitionDuration: "0s", userSelect: "none" },
  column: {
    display: { [WIDE]: "block", default: "none" },
    position: "relative",
    zIndex: 1,
    minWidth: 0,
  },
  sticky: {
    position: "sticky",
    height: `calc(100dvh - ${TOP_BAR})`,
    top: TOP_BAR,
  },
  clip: {
    overflow: "hidden",
    borderRightColor: colors.line,
    borderRightStyle: "solid",
    borderRightWidth: 1,
    height: "100%",
  },
  clipClosed: { borderRightColor: "transparent" },
  panel: {
    opacity: 1,
    transitionDuration: { [REDUCED]: "0s", default: motion.move },
    transitionProperty: "opacity",
    transitionTimingFunction: motion.easeOut,
    height: "100%",
    width: `var(--sidebar-width, ${INITIAL})`,
  },
  panelClosed: { opacity: 0 },
  handle: {
    cursor: "col-resize",
    outlineStyle: "none",
    position: "absolute",
    touchAction: "none",
    bottom: 0,
    right: -6,
    top: 0,
    width: 12,
  },
  handleClosed: { cursor: "e-resize", right: -12 },
  line: {
    backgroundColor: {
      default: "transparent",
      [stylex.when.ancestor(":focus-visible")]: colors.focus,
      [stylex.when.ancestor(":hover")]: colors.lineStrong,
    },
    position: "absolute",
    transitionDuration: motion.press,
    transitionProperty: "background-color",
    bottom: 0,
    left: 5,
    top: 0,
    width: 2,
  },
  lineActive: { backgroundColor: colors.lineStrong },
  grip: {
    borderRadius: 3,
    backgroundColor: colors.inkMuted,
    opacity: {
      default: 0,
      [stylex.when.ancestor(":focus-visible")]: 1,
      [stylex.when.ancestor(":hover")]: 1,
    },
    position: "absolute",
    transform: {
      default: "scaleY(0.6)",
      [stylex.when.ancestor(":focus-visible")]: "scaleY(1)",
      [stylex.when.ancestor(":hover")]: "scaleY(1)",
    },
    transitionDuration: motion.press,
    transitionProperty: "opacity, transform",
    transitionTimingFunction: motion.easeOut,
    height: 36,
    left: 3,
    marginTop: -18,
    top: "50%",
    width: 6,
  },
  gripActive: { backgroundColor: colors.ink, opacity: 1, transform: "scaleY(1)" },
});

type SidebarColumnsProps = {
  sidebar: ReactNode;
  children: ReactNode;
};

function keyedWidth(key: string, width: number, step: number): number | null {
  switch (key) {
    case "ArrowLeft":
      return width - step;
    case "ArrowRight":
      return width + step;
    case "Home":
      return SIDEBAR.min;
    case "End":
      return SIDEBAR.max;
    default:
      return null;
  }
}

function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    toggleSidebar();
    return;
  }
  const step = event.shiftKey ? KEY_STEP * 4 : KEY_STEP;
  const next = keyedWidth(event.key, getSidebarWidth(), step);
  if (next !== null) {
    event.preventDefault();
    commitSidebar({ collapsed: false, width: next });
  }
}

export function SidebarColumns({ sidebar, children }: SidebarColumnsProps) {
  const collapsed = useSidebarCollapsed();
  const width = useSidebarWidth();
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ x: number; from: number; to: number; moved: boolean } | null>(null);

  useEffect(() => {
    function onKey(event: globalThis.KeyboardEvent) {
      if (event.key === "\\" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggleSidebar();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) {
      return;
    }
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    const from = collapsed ? 0 : getSidebarWidth();
    drag.current = { x: event.clientX, from, to: from, moved: false };
    setDragging(true);
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const state = drag.current;
    if (!state) {
      return;
    }
    const raw = state.from + event.clientX - state.x;
    if (Math.abs(event.clientX - state.x) > 3) {
      state.moved = true;
    }
    state.to = raw;
    previewWidth(raw < SIDEBAR.snap ? 0 : clampWidth(raw));
  }

  function onPointerUp() {
    const state = drag.current;
    drag.current = null;
    setDragging(false);
    if (!state) {
      return;
    }
    if (!state.moved) {
      toggleSidebar();
    } else if (state.to < SIDEBAR.snap) {
      commitSidebar({ collapsed: true });
    } else {
      commitSidebar({ collapsed: false, width: state.to });
    }
  }

  return (
    <div {...stylex.props(styles.columns, dragging && styles.dragging)}>
      <div {...stylex.props(styles.column)}>
        <div {...stylex.props(styles.sticky)}>
          <div {...stylex.props(styles.clip, collapsed && !dragging && styles.clipClosed)}>
            <div
              id="lesson-sidebar"
              inert={collapsed && !dragging}
              {...stylex.props(styles.panel, collapsed && !dragging && styles.panelClosed)}
            >
              {sidebar}
            </div>
          </div>
          <div
            role="separator"
            tabIndex={0}
            aria-orientation="vertical"
            aria-controls="lesson-sidebar"
            aria-label="Resize sidebar"
            aria-valuemin={0}
            aria-valuemax={SIDEBAR.max}
            aria-valuenow={collapsed ? 0 : width}
            title={collapsed ? "Click or drag to open" : "Drag to resize, click to close"}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onKeyDown={onKeyDown}
            {...stylex.props(
              styles.handle,
              collapsed && !dragging && styles.handleClosed,
              stylex.defaultMarker(),
            )}
          >
            <span {...stylex.props(styles.line, dragging && styles.lineActive)} />
            <span {...stylex.props(styles.grip, dragging && styles.gripActive)} />
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
