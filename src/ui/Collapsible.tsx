import { Collapsible as BaseCollapsible } from "@base-ui/react/collapsible";
import * as stylex from "@stylexjs/stylex";
import { ChevronRight } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

import { colors, motion, space } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";

import { Icon } from "./Icon";

const HOVER = "@media (hover: hover)";
const REDUCED = "@media (prefers-reduced-motion: reduce)";
const OPEN = ":is([data-panel-open])";
const HIDDEN = ":is([data-starting-style], [data-ending-style])";

const styles = stylex.create({
  trigger: {
    borderRadius: 6,
    borderWidth: 0,
    gap: space.s2,
    paddingBlock: 0,
    paddingInline: 10,
    alignItems: "center",
    backgroundColor: {
      default: "transparent",
      ":hover": { [HOVER]: colors.sunken, default: null },
    },
    color: { [OPEN]: colors.ink, default: colors.inkSoft },
    cursor: "pointer",
    display: "flex",
    fontWeight: { [OPEN]: 500, default: 400 },
    outlineColor: colors.focus,
    outlineOffset: -2,
    outlineStyle: { default: "none", ":focus-visible": "solid" },
    outlineWidth: 2,
    textAlign: "start",
    height: 30,
    minWidth: 0,
    width: "100%",
  },
  chevron: {
    color: colors.inkMuted,
    display: "inline-flex",
    transform: { default: null, [stylex.when.ancestor(OPEN)]: "rotate(90deg)" },
    transitionDuration: { [REDUCED]: "0s", default: motion.move },
    transitionProperty: "transform",
    transitionTimingFunction: motion.easeOut,
  },
  meta: { color: colors.inkMuted, fontWeight: 400, marginInlineStart: "auto" },
  panel: {
    overflow: "hidden",
    transitionDuration: { [REDUCED]: "0s", default: motion.move },
    transitionProperty: "height",
    transitionTimingFunction: motion.easeOut,
    height: { [HIDDEN]: 0, default: "var(--collapsible-panel-height)" },
  },
});

type Unstyled<T> = Omit<T, "className" | "style">;

export function Collapsible(props: Unstyled<ComponentProps<typeof BaseCollapsible.Root>>) {
  return <BaseCollapsible.Root {...props} />;
}

type TriggerProps = Unstyled<ComponentProps<typeof BaseCollapsible.Trigger>> & {
  meta?: ReactNode;
};

export function CollapsibleTrigger({ children, meta, ...props }: TriggerProps) {
  return (
    <BaseCollapsible.Trigger
      {...props}
      {...stylex.props(type.ui, styles.trigger, stylex.defaultMarker())}
    >
      <span {...stylex.props(styles.chevron)}>
        <Icon icon={ChevronRight} size={12} />
      </span>
      {children}
      {meta !== undefined && meta !== null && (
        <span {...stylex.props(type.number, styles.meta)}>{meta}</span>
      )}
    </BaseCollapsible.Trigger>
  );
}

export function CollapsiblePanel(props: Unstyled<ComponentProps<typeof BaseCollapsible.Panel>>) {
  return <BaseCollapsible.Panel {...props} {...stylex.props(styles.panel)} />;
}
