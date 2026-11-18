"use client";

import * as stylex from "@stylexjs/stylex";
import { PanelLeftOpen } from "lucide-react";
import { IconButton } from "@/ui/IconButton";
import { Tooltip } from "@/ui/Tooltip";
import { toggleSidebar, useSidebarCollapsed } from "./sidebarState";

const WIDE = "@media (min-width: 768px)";

const styles = stylex.create({
  wrap: { display: { default: "none", [WIDE]: "inline-flex" } },
});

export function SidebarToggle() {
  const collapsed = useSidebarCollapsed();
  if (!collapsed) return null;

  const label = "Show sidebar";
  return (
    <span {...stylex.props(styles.wrap)}>
      <Tooltip label={label} shortcut="⌘\">
        <IconButton
          icon={PanelLeftOpen}
          label={label}
          variant="ghost"
          size="small"
          aria-controls="lesson-sidebar"
          aria-expanded={false}
          onClick={toggleSidebar}
        />
      </Tooltip>
    </span>
  );
}
