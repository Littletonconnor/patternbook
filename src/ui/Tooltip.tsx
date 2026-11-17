import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import * as stylex from "@stylexjs/stylex";
import type { ReactElement, ReactNode } from "react";
import { colors, motion } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";

const HIDDEN = ":is([data-starting-style], [data-ending-style])";
const REDUCED = "@media (prefers-reduced-motion: reduce)";

const styles = stylex.create({
  popup: {
    maxWidth: 260,
    backgroundColor: colors.ink,
    color: colors.paper,
    boxShadow: "0 6px 20px rgb(22 24 29 / 0.16)",
    opacity: { default: 1, [HIDDEN]: 0 },
    transform: { default: "translateY(0)", [HIDDEN]: "translateY(4px)" },
    transitionProperty: { default: "opacity, transform", [REDUCED]: "opacity" },
    transitionDuration: { default: motion.press, ":is([data-instant])": "0s" },
    transitionTimingFunction: motion.easeOut,
  },
  rich: { paddingBlock: 10, paddingInline: 12, borderRadius: 8 },
  short: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    paddingBlock: 6,
    paddingInline: 8,
    borderRadius: 6,
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
  const rich = description != null;
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
