"use client";

import * as stylex from "@stylexjs/stylex";
import { useRef } from "react";
import type { KeyboardEvent, PointerEvent } from "react";

import {
  SIDEBAR,
  clampWidth,
  commitSidebar,
  getSidebarWidth,
  previewWidth,
  toggleSidebar,
} from "@/hooks/useSidebar";
import { colors, motion } from "@/tokens/tokens.stylex";

const KEY_STEP = 16;

const styles = stylex.create({
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

type Drag = { x: number; from: number; to: number; moved: boolean };

function finishDrag(state: Drag) {
  if (!state.moved) {
    toggleSidebar();
  } else if (state.to < SIDEBAR.snap) {
    commitSidebar({ collapsed: true });
  } else {
    commitSidebar({ collapsed: false, width: state.to });
  }
}

function useDrag(collapsed: boolean, onDraggingChange: (dragging: boolean) => void) {
  const drag = useRef<Drag | null>(null);

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) {
      return;
    }
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    const from = collapsed ? 0 : getSidebarWidth();
    drag.current = { x: event.clientX, from, to: from, moved: false };
    onDraggingChange(true);
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
    onDraggingChange(false);
    if (state) {
      finishDrag(state);
    }
  }

  return { onPointerDown, onPointerMove, onPointerUp };
}

type SidebarHandleProps = {
  collapsed: boolean;
  width: number;
  dragging: boolean;
  onDraggingChange: (dragging: boolean) => void;
};

export function SidebarHandle({
  collapsed,
  width,
  dragging,
  onDraggingChange,
}: SidebarHandleProps) {
  const { onPointerDown, onPointerMove, onPointerUp } = useDrag(collapsed, onDraggingChange);
  return (
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
  );
}
