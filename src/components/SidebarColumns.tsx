"use client";

import * as stylex from "@stylexjs/stylex";
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
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
} from "./sidebarState";

const WIDE = "@media (min-width: 768px)";
const REDUCED = "@media (prefers-reduced-motion: reduce)";
const TOP_BAR = "57px";
const INITIAL = "264px";
const TRACK = `var(--sidebar-track, ${INITIAL})`;
const KEY_STEP = 16;

const styles = stylex.create({
  columns: {
    flexGrow: 1,
    display: "grid",
    gridTemplateColumns: {
      default: "minmax(0, 1fr)",
      [WIDE]: `${TRACK} minmax(0, 1fr)`,
    },
    transitionProperty: "grid-template-columns",
    transitionDuration: { default: motion.move, [REDUCED]: "0s" },
    transitionTimingFunction: motion.easeOut,
  },
  dragging: { transitionDuration: "0s", cursor: "col-resize", userSelect: "none" },
  column: {
    display: { default: "none", [WIDE]: "block" },
    position: "relative",
    zIndex: 1,
    minWidth: 0,
  },
  sticky: {
    position: "sticky",
    top: TOP_BAR,
    height: `calc(100dvh - ${TOP_BAR})`,
  },
  clip: {
    height: "100%",
    overflow: "hidden",
    borderRightWidth: 1,
    borderRightStyle: "solid",
    borderRightColor: colors.line,
  },
  clipClosed: { borderRightColor: "transparent" },
  panel: {
    width: `var(--sidebar-width, ${INITIAL})`,
    height: "100%",
    opacity: 1,
    transitionProperty: "opacity",
    transitionDuration: { default: motion.move, [REDUCED]: "0s" },
    transitionTimingFunction: motion.easeOut,
  },
  panelClosed: { opacity: 0 },
  handle: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: -6,
    width: 12,
    cursor: "col-resize",
    touchAction: "none",
    outlineStyle: "none",
  },
  handleClosed: { right: -12, cursor: "e-resize" },
  line: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 5,
    width: 2,
    backgroundColor: {
      default: "transparent",
      [stylex.when.ancestor(":hover")]: colors.lineStrong,
      [stylex.when.ancestor(":focus-visible")]: colors.focus,
    },
    transitionProperty: "background-color",
    transitionDuration: motion.press,
  },
  lineActive: { backgroundColor: colors.lineStrong },
  grip: {
    position: "absolute",
    top: "50%",
    left: 3,
    width: 6,
    height: 36,
    marginTop: -18,
    borderRadius: 3,
    backgroundColor: colors.inkMuted,
    opacity: {
      default: 0,
      [stylex.when.ancestor(":hover")]: 1,
      [stylex.when.ancestor(":focus-visible")]: 1,
    },
    transform: {
      default: "scaleY(0.6)",
      [stylex.when.ancestor(":hover")]: "scaleY(1)",
      [stylex.when.ancestor(":focus-visible")]: "scaleY(1)",
    },
    transitionProperty: "opacity, transform",
    transitionDuration: motion.press,
    transitionTimingFunction: motion.easeOut,
  },
  gripActive: { opacity: 1, transform: "scaleY(1)", backgroundColor: colors.ink },
});

type SidebarColumnsProps = {
  sidebar: ReactNode;
  children: ReactNode;
};

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
    if (event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    const from = collapsed ? 0 : getSidebarWidth();
    drag.current = { x: event.clientX, from, to: from, moved: false };
    setDragging(true);
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const state = drag.current;
    if (!state) return;
    const raw = state.from + event.clientX - state.x;
    if (Math.abs(event.clientX - state.x) > 3) state.moved = true;
    state.to = raw;
    previewWidth(raw < SIDEBAR.snap ? 0 : clampWidth(raw));
  }

  function onPointerUp() {
    const state = drag.current;
    drag.current = null;
    setDragging(false);
    if (!state) return;
    if (!state.moved) {
      toggleSidebar();
    } else if (state.to < SIDEBAR.snap) {
      commitSidebar({ collapsed: true });
    } else {
      commitSidebar({ collapsed: false, width: state.to });
    }
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const width = getSidebarWidth();
    const step = event.shiftKey ? KEY_STEP * 4 : KEY_STEP;
    const next =
      event.key === "ArrowLeft"
        ? width - step
        : event.key === "ArrowRight"
          ? width + step
          : event.key === "Home"
            ? SIDEBAR.min
            : event.key === "End"
              ? SIDEBAR.max
              : null;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleSidebar();
    } else if (next != null) {
      event.preventDefault();
      commitSidebar({ collapsed: false, width: next });
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
