import * as stylex from "@stylexjs/stylex";
import { ChevronsDownUp, PanelLeftClose } from "lucide-react";

import { toggleSidebar } from "@/hooks/useSidebar";
import { colors, space } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";
import { Icon } from "@/ui/Icon";
import { Tooltip } from "@/ui/Tooltip";

const HOVER = "@media (hover: hover)";

const styles = stylex.create({
  head: {
    alignItems: "center",
    color: colors.inkMuted,
    display: "flex",
    flexShrink: 0,
    justifyContent: "space-between",
    paddingInlineEnd: space.s3,
    paddingInlineStart: 10,
    height: 28,
    marginBottom: space.s1,
  },
  actions: { gap: 2, alignItems: "center", display: "flex" },
  collapseAll: {
    padding: 0,
    borderRadius: 6,
    borderWidth: 0,
    alignItems: "center",
    backgroundColor: {
      default: "transparent",
      ":hover": { [HOVER]: colors.sunken, default: null },
    },
    color: { default: colors.inkMuted, ":hover": { [HOVER]: colors.ink, default: null } },
    cursor: "pointer",
    display: "inline-flex",
    justifyContent: "center",
    opacity: { default: 1, ":disabled": 0.4 },
    outlineColor: colors.focus,
    outlineOffset: -2,
    outlineStyle: { default: "none", ":focus-visible": "solid" },
    outlineWidth: 2,
    height: 24,
    width: 24,
  },
});

type SidebarHeaderProps = {
  canCollapse: boolean;
  onCollapseAll: () => void;
  closable: boolean;
};

export function SidebarHeader({ canCollapse, onCollapseAll, closable }: SidebarHeaderProps) {
  return (
    <div {...stylex.props(styles.head)}>
      <span {...stylex.props(type.labelSmall)}>Topics</span>
      <div {...stylex.props(styles.actions)}>
        <Tooltip label="Collapse all topics">
          <button
            type="button"
            aria-label="Collapse all topics"
            disabled={!canCollapse}
            onClick={onCollapseAll}
            {...stylex.props(styles.collapseAll)}
          >
            <Icon icon={ChevronsDownUp} size={14} />
          </button>
        </Tooltip>
        {closable && (
          <Tooltip label="Hide sidebar" shortcut="⌘\">
            <button
              type="button"
              aria-label="Hide sidebar"
              aria-controls="lesson-sidebar"
              onClick={toggleSidebar}
              {...stylex.props(styles.collapseAll)}
            >
              <Icon icon={PanelLeftClose} size={14} />
            </button>
          </Tooltip>
        )}
      </div>
    </div>
  );
}
