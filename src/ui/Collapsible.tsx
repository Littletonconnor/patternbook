import { Collapsible as BaseCollapsible } from "@base-ui/react/collapsible";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps, ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { colors, motion } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";
import { Icon } from "./Icon";

const HOVER = "@media (hover: hover)";
const REDUCED = "@media (prefers-reduced-motion: reduce)";
const OPEN = ":is([data-panel-open])";
const HIDDEN = ":is([data-starting-style], [data-ending-style])";

const styles = stylex.create({
  trigger: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    width: "100%",
    minWidth: 0,
    height: 30,
    paddingBlock: 0,
    paddingInline: 10,
    borderWidth: 0,
    borderRadius: 6,
    textAlign: "start",
    cursor: "pointer",
    color: { default: colors.inkSoft, [OPEN]: colors.ink },
    fontWeight: { default: 400, [OPEN]: 500 },
    backgroundColor: {
      default: "transparent",
      ":hover": { default: null, [HOVER]: colors.sunken },
    },
    outlineStyle: { default: "none", ":focus-visible": "solid" },
    outlineWidth: 2,
    outlineOffset: -2,
    outlineColor: colors.focus,
  },
  chevron: {
    display: "inline-flex",
    color: colors.inkMuted,
    transform: { default: null, [stylex.when.ancestor(OPEN)]: "rotate(90deg)" },
    transitionProperty: "transform",
    transitionDuration: { default: motion.move, [REDUCED]: "0s" },
    transitionTimingFunction: motion.easeOut,
  },
  meta: { marginInlineStart: "auto", fontWeight: 400, color: colors.inkMuted },
  panel: {
    overflow: "hidden",
    height: { default: "var(--collapsible-panel-height)", [HIDDEN]: 0 },
    transitionProperty: "height",
    transitionDuration: { default: motion.move, [REDUCED]: "0s" },
    transitionTimingFunction: motion.easeOut,
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
      {meta != null && <span {...stylex.props(type.number, styles.meta)}>{meta}</span>}
    </BaseCollapsible.Trigger>
  );
}

export function CollapsiblePanel(props: Unstyled<ComponentProps<typeof BaseCollapsible.Panel>>) {
  return <BaseCollapsible.Panel {...props} {...stylex.props(styles.panel)} />;
}
