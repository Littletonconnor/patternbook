import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";
import { colors, motion, radius } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";

const HOVER = "@media (hover: hover)";
const REDUCED = "@media (prefers-reduced-motion: reduce)";
const SELECTED = ":is([data-active])";

const styles = stylex.create({
  list: {
    position: "relative",
    display: "flex",
    gap: 20,
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: colors.line,
  },
  tab: {
    paddingTop: 0,
    paddingInline: 0,
    paddingBottom: 10,
    borderWidth: 0,
    backgroundColor: "transparent",
    cursor: "pointer",
    color: {
      default: colors.inkSoft,
      ":hover": { default: null, [HOVER]: colors.ink },
      [SELECTED]: colors.ink,
    },
    fontWeight: { default: 400, [SELECTED]: 500 },
    borderRadius: radius.mark,
    outlineStyle: { default: "none", ":focus-visible": "solid" },
    outlineWidth: 2,
    outlineOffset: -2,
    outlineColor: colors.focus,
  },
  indicator: {
    position: "absolute",
    bottom: -1,
    left: "var(--active-tab-left)",
    width: "var(--active-tab-width)",
    height: 2,
    backgroundColor: colors.ink,
    transitionProperty: "left, width",
    transitionDuration: { default: motion.move, [REDUCED]: "0s" },
    transitionTimingFunction: motion.easeOut,
  },
  panel: {
    borderRadius: radius.mark,
    outlineStyle: { default: "none", ":focus-visible": "solid" },
    outlineWidth: 2,
    outlineOffset: 2,
    outlineColor: colors.focus,
  },
});

type Unstyled<T> = Omit<T, "className" | "style">;

export function Tabs(props: Unstyled<ComponentProps<typeof BaseTabs.Root>>) {
  return <BaseTabs.Root {...props} />;
}

export function TabsList({ children, ...props }: Unstyled<ComponentProps<typeof BaseTabs.List>>) {
  return (
    <BaseTabs.List {...props} {...stylex.props(styles.list)}>
      {children}
      <BaseTabs.Indicator {...stylex.props(styles.indicator)} />
    </BaseTabs.List>
  );
}

export function Tab(props: Unstyled<ComponentProps<typeof BaseTabs.Tab>>) {
  return <BaseTabs.Tab {...props} {...stylex.props(type.codeSmall, styles.tab)} />;
}

export function TabsPanel(props: Unstyled<ComponentProps<typeof BaseTabs.Panel>>) {
  return <BaseTabs.Panel {...props} {...stylex.props(styles.panel)} />;
}
