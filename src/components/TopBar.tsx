"use client";

import * as stylex from "@stylexjs/stylex";
import { Menu } from "lucide-react";
import type { ReactNode } from "react";
import { colors, radius, space } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";
import { Drawer } from "@/ui/Drawer";
import { IconButton } from "@/ui/IconButton";
import { Kbd } from "@/ui/Kbd";
import { Link } from "@/ui/Link";
import { Brand } from "./Brand";

const WIDE = "@media (min-width: 768px)";

const styles = stylex.create({
  bar: {
    display: "flex",
    alignItems: "center",
    gap: space.s6,
    minHeight: 57,
    paddingBlock: space.s3,
    paddingInline: { default: space.s4, [WIDE]: space.s6 },
    backgroundColor: colors.paper,
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: colors.line,
  },
  nav: { display: { default: "none", [WIDE]: "flex" }, gap: space.s6 },
  end: { marginInlineStart: "auto", display: "flex", alignItems: "center" },
  search: {
    display: { default: "none", [WIDE]: "inline-flex" },
    alignItems: "center",
    justifyContent: "space-between",
    gap: space.s6,
    minWidth: 180,
    height: 32,
    paddingInlineStart: 10,
    paddingInlineEnd: space.s2,
    color: colors.inkMuted,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors.line,
    borderRadius: radius.control,
    cursor: "pointer",
    outlineStyle: { default: "none", ":focus-visible": "solid" },
    outlineWidth: 2,
    outlineOffset: 2,
    outlineColor: colors.focus,
  },
  menu: { display: { default: "flex", [WIDE]: "none" } },
  drawerNav: { display: "flex", flexDirection: "column", gap: space.s3, paddingBottom: space.s4 },
});

export type Section = "lessons" | "figures" | "about";

const links: { section: Section; label: string; href: string }[] = [
  { section: "lessons", label: "Lessons", href: "/lessons" },
  { section: "figures", label: "Figures", href: "/figures" },
  { section: "about", label: "About", href: "/about" },
];

type TopBarProps = {
  current?: Section;
  drawer?: ReactNode;
};

export function TopBar({ current, drawer }: TopBarProps) {
  const nav = links.map((link) => (
    <Link key={link.section} variant="nav" href={link.href} current={link.section === current}>
      {link.label}
    </Link>
  ));

  return (
    <header {...stylex.props(styles.bar)}>
      <Brand />
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
