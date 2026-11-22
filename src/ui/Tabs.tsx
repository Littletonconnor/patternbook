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
    gap: 20,
    display: "flex",
    position: "relative",
    borderBottomColor: colors.line,
    borderBottomStyle: "solid",
    borderBottomWidth: 1,
  },
  tab: {
    borderRadius: radius.mark,
    borderWidth: 0,
    paddingInline: 0,
    backgroundColor: "transparent",
    color: {
      [SELECTED]: colors.ink,
      default: colors.inkSoft,
      ":hover": { [HOVER]: colors.ink, default: null },
    },
    cursor: "pointer",
    fontWeight: { [SELECTED]: 500, default: 400 },
    outlineColor: colors.focus,
    outlineOffset: -2,
    outlineStyle: { default: "none", ":focus-visible": "solid" },
    outlineWidth: 2,
    paddingBottom: 10,
    paddingTop: 0,
  },
  indicator: {
    backgroundColor: colors.ink,
    position: "absolute",
    transitionDuration: { [REDUCED]: "0s", default: motion.move },
    transitionProperty: "left, width",
    transitionTimingFunction: motion.easeOut,
    bottom: -1,
    height: 2,
    left: "var(--active-tab-left)",
    width: "var(--active-tab-width)",
  },
  panel: {
    borderRadius: radius.mark,
    outlineColor: colors.focus,
    outlineOffset: 2,
    outlineStyle: { default: "none", ":focus-visible": "solid" },
    outlineWidth: 2,
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
