import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import * as stylex from "@stylexjs/stylex";
import type { ReactElement, ReactNode } from "react";

import { colors, motion, shadows, space } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";

const HIDDEN = ":is([data-starting-style], [data-ending-style])";
const REDUCED = "@media (prefers-reduced-motion: reduce)";

const styles = stylex.create({
  popup: {
    backgroundColor: colors.ink,
    boxShadow: shadows.popover,
    color: colors.paper,
    opacity: { [HIDDEN]: 0, default: 1 },
    transform: { [HIDDEN]: "translateY(4px)", default: "translateY(0)" },
    transitionDuration: { default: motion.press, ":is([data-instant])": "0s" },
    transitionProperty: { [REDUCED]: "opacity", default: "opacity, transform" },
    transitionTimingFunction: motion.easeOut,
    maxWidth: 260,
  },
  rich: { borderRadius: 8, paddingBlock: 10, paddingInline: space.s3 },
  short: {
    borderRadius: 6,
    gap: 6,
    paddingBlock: 6,
    paddingInline: space.s2,
    alignItems: "center",
    display: "flex",
  },
  body: { color: colors.lineStrong },
  shortcut: { color: colors.lineStrong },
});

export function TooltipProvider({ children }: { children: ReactNode }) {
  return <BaseTooltip.Provider delay={400}>{children}</BaseTooltip.Provider>;
}

type TooltipProps = {
  label: ReactNode;
  description?: ReactNode;
  shortcut?: string;
  children: ReactElement;
};

export function Tooltip({ label, description, shortcut, children }: TooltipProps) {
  const rich = description !== undefined && description !== null;
  return (
    <BaseTooltip.Root>
      <BaseTooltip.Trigger delay={400} render={children} />
      <BaseTooltip.Portal>
        <BaseTooltip.Positioner side="top" sideOffset={6}>
          <BaseTooltip.Popup
            {...stylex.props(styles.popup, rich ? styles.rich : [type.caption, styles.short])}
          >
            {rich ? (
              <>
                <div {...stylex.props(type.control)}>{label}</div>
                <div {...stylex.props(type.ui, styles.body)}>{description}</div>
              </>
            ) : (
              <>
                {label}
                {shortcut && (
                  <span {...stylex.props(type.number, styles.shortcut)}>{shortcut}</span>
                )}
              </>
            )}
          </BaseTooltip.Popup>
        </BaseTooltip.Positioner>
      </BaseTooltip.Portal>
    </BaseTooltip.Root>
  );
}
