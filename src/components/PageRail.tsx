"use client";

import * as stylex from "@stylexjs/stylex";
import { useEffect, useState } from "react";
import { colors, measure, radius, space } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";

const HOVER = "@media (hover: hover)";
const ACTIVE = ":is([aria-current=true])";

const styles = stylex.create({
  rail: {
    display: { default: "none", "@media (min-width: 1180px)": "flex" },
    flexDirection: "column",
    gap: space.s3,
    width: measure.rail,
    position: "sticky",
    top: `calc(57px + ${space.s6})`, // below the sticky top bar
    alignSelf: "flex-start",
  },
  label: { color: colors.inkMuted },
  list: { display: "flex", flexDirection: "column", margin: 0, padding: 0, listStyle: "none" },
  link: {
    display: "block",
    paddingBlock: 2,
    paddingInlineStart: 10,
    textDecorationLine: "none",
    borderLeftWidth: 2,
    borderLeftStyle: "solid",
    borderLeftColor: { default: "transparent", [ACTIVE]: colors.ink },
    color: {
      default: colors.inkSoft,
      ":hover": { default: null, [HOVER]: colors.ink },
      [ACTIVE]: colors.ink,
    },
    fontWeight: { default: 400, [ACTIVE]: 500 },
    outlineStyle: { default: "none", ":focus-visible": "solid" },
    outlineWidth: 2,
    outlineOffset: 2,
    outlineColor: colors.focus,
    borderRadius: radius.mark,
  },
});

export type RailItem = { id: string; label: string };

export function PageRail({ items }: { items: readonly RailItem[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "0px 0px -70% 0px" },
    );
    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav aria-label="On this page" {...stylex.props(styles.rail)}>
      <span {...stylex.props(type.labelSmall, styles.label)}>On this page</span>
      <ul {...stylex.props(styles.list)}>
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={item.id === active ? "true" : undefined}
              {...stylex.props(type.ui, styles.link)}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
