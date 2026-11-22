"use client";

import * as stylex from "@stylexjs/stylex";
import { useState } from "react";
import type { ReactNode } from "react";
import { colors, motion } from "@/tokens/tokens.stylex";
import { toggleSidebar, useSidebarCollapsed, useSidebarWidth } from "@/hooks/useSidebar";
import { useWindowEvent } from "@/hooks/useWindowEvent";
import { SidebarHandle } from "./SidebarHandle";

const WIDE = "@media (min-width: 768px)";
const REDUCED = "@media (prefers-reduced-motion: reduce)";
const TOP_BAR = "57px";
const INITIAL = "264px";
const TRACK = `var(--sidebar-track, ${INITIAL})`;

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
});

type SidebarColumnsProps = {
  sidebar: ReactNode;
  children: ReactNode;
};

function useToggleShortcut() {
  useWindowEvent("keydown", (event) => {
    if (event.key === "\\" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      toggleSidebar();
    }
  });
}

export function SidebarColumns({ sidebar, children }: SidebarColumnsProps) {
  const collapsed = useSidebarCollapsed();
  const width = useSidebarWidth();
  const [dragging, setDragging] = useState(false);
  const closed = collapsed && !dragging;
  useToggleShortcut();

  return (
    <div {...stylex.props(styles.columns, dragging && styles.dragging)}>
      <div {...stylex.props(styles.column)}>
        <div {...stylex.props(styles.sticky)}>
          <div {...stylex.props(styles.clip, closed && styles.clipClosed)}>
            <div
              id="lesson-sidebar"
              inert={closed}
              {...stylex.props(styles.panel, closed && styles.panelClosed)}
            >
              {sidebar}
            </div>
          </div>
          <SidebarHandle
            collapsed={collapsed}
            width={width}
            dragging={dragging}
            onDraggingChange={setDragging}
          />
        </div>
      </div>
      {children}
    </div>
  );
}
