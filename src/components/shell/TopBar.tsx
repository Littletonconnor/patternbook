"use client";

import * as stylex from "@stylexjs/stylex";
import { Menu } from "lucide-react";
import type { Route } from "next";
import type { ReactNode } from "react";

import { colors, measure, radius, space } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";
import { Drawer } from "@/ui/Drawer";
import { IconButton } from "@/ui/IconButton";
import { Kbd } from "@/ui/Kbd";
import { Link } from "@/ui/Link";

import { Brand } from "./Brand";

const WIDE = "@media (min-width: 768px)";

const styles = stylex.create({
  bar: {
    gap: space.s6,
    paddingBlock: space.s3,
    paddingInline: {
      [WIDE]: `max(${space.s6}, calc((100% - ${measure.page}) / 2 + ${space.s6}))`,
      default: space.s4,
    },
    alignItems: "center",
    backgroundColor: colors.paper,
    boxSizing: "border-box",
    display: "flex",
    borderBottomColor: colors.line,
    borderBottomStyle: "solid",
    borderBottomWidth: 1,
    height: 57,
  },
  fluid: { paddingInline: space.s4 },
  start: { gap: space.s3, alignItems: "center", display: "flex" },
  nav: { gap: space.s6, display: { [WIDE]: "flex", default: "none" } },
  end: { alignItems: "center", display: "flex", marginInlineStart: "auto" },
  search: {
    borderColor: colors.line,
    borderRadius: radius.control,
    borderStyle: "solid",
    borderWidth: 1,
    gap: space.s6,
    alignItems: "center",
    backgroundColor: colors.surface,
    color: colors.inkMuted,
    cursor: "pointer",
    display: { [WIDE]: "inline-flex", default: "none" },
    justifyContent: "space-between",
    outlineColor: colors.focus,
    outlineOffset: 2,
    outlineStyle: { default: "none", ":focus-visible": "solid" },
    outlineWidth: 2,
    paddingInlineEnd: space.s2,
    paddingInlineStart: 10,
    height: 32,
    minWidth: 180,
  },
  menu: { display: { [WIDE]: "none", default: "flex" } },
  drawerNav: { gap: space.s3, display: "flex", flexDirection: "column", paddingBottom: space.s4 },
});

export type Section = "lessons" | "diagrams" | "about";

const links: { section: Section; label: string; href: Route }[] = [
  { section: "lessons", label: "Lessons", href: "/lessons" },
  { section: "diagrams", label: "Diagrams", href: "/diagrams" },
  { section: "about", label: "About", href: "/about" },
];

type TopBarProps = {
  current?: Section | undefined;
  drawer?: ReactNode;
  start?: ReactNode;
  fluid?: boolean;
};

export function TopBar({ current, drawer, start, fluid = false }: TopBarProps) {
  const nav = links.map((link) => (
    <Link key={link.section} variant="nav" href={link.href} current={link.section === current}>
      {link.label}
    </Link>
  ));

  return (
    <header {...stylex.props(styles.bar, fluid && styles.fluid)}>
      <div {...stylex.props(styles.start)}>
        {start}
        <Brand />
      </div>
      <nav aria-label="Main" {...stylex.props(styles.nav)}>
        {nav}
      </nav>
      <div {...stylex.props(styles.end)}>
        <button type="button" {...stylex.props(type.ui, styles.search)}>
          Search
          <Kbd>⌘K</Kbd>
        </button>
        <span {...stylex.props(styles.menu)}>
          <Drawer
            title="Menu"
            trigger={<IconButton icon={Menu} label="Open menu" variant="ghost" />}
          >
            <nav aria-label="Main" {...stylex.props(styles.drawerNav)}>
              {nav}
            </nav>
            {drawer}
          </Drawer>
        </span>
      </div>
    </header>
  );
}
