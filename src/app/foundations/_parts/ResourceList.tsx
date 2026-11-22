import * as stylex from "@stylexjs/stylex";
import { ArrowUpRight } from "lucide-react";

import { colors, motion, radius, space } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";
import { Icon } from "@/ui/Icon";

const HOVER = "@media (hover: hover)";
const NARROW = "@media (max-width: 639px)";

const styles = stylex.create({
  list: {
    margin: 0,
    padding: 0,
    borderColor: colors.line,
    borderRadius: radius.frame,
    borderStyle: "solid",
    borderWidth: 1,
    listStyle: "none",
    overflow: "hidden",
    backgroundColor: colors.surface,
  },
  item: {
    borderTopColor: colors.line,
    borderTopStyle: "solid",
    borderTopWidth: { default: 1, ":first-child": 0 },
  },
  row: {
    gap: { [NARROW]: space.s1, default: 20 },
    paddingBlock: space.s4,
    paddingInline: 18,
    alignItems: "baseline",
    backgroundColor: {
      default: "transparent",
      ":hover": { [HOVER]: colors.paper, default: null },
    },
    color: colors.ink,
    display: "grid",
    gridTemplateColumns: { [NARROW]: "1fr", default: "104px minmax(0, 1fr) auto" },
    outlineColor: colors.focus,
    outlineOffset: -2,
    outlineStyle: { default: "none", ":focus-visible": "solid" },
    outlineWidth: 2,
    textDecorationLine: "none",
    transitionDuration: motion.press,
    transitionProperty: "background-color",
  },
  kind: { color: colors.inkMuted },
  text: { gap: 2, display: "flex", flexDirection: "column" },
  title: {
    fontWeight: 500,
    textDecorationLine: { default: "none", [stylex.when.ancestor(":hover")]: "underline" },
    textUnderlineOffset: 3,
  },
  why: { color: colors.inkSoft },
  source: { gap: 2, alignItems: "center", color: colors.inkMuted, display: "inline-flex" },
  arrow: {
    color: { default: colors.inkMuted, [stylex.when.ancestor(":hover")]: colors.signal },
    display: "inline-flex",
    transform: { default: null, [stylex.when.ancestor(":hover")]: "translate(2px, -2px)" },
    transitionDuration: motion.press,
    transitionProperty: "color, transform",
    transitionTimingFunction: motion.easeOut,
  },
});

export type Resource = {
  kind: "Article" | "Docs" | "Talk" | "Paper" | "Source";
  title: string;
  why: string;
  href: string;
};

function sourceOf(href: string) {
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return href;
  }
}

export function ResourceList({ resources }: { resources: readonly Resource[] }) {
  return (
    <ol {...stylex.props(styles.list)}>
      {resources.map((resource, i) => (
        <li key={resource.href} {...stylex.props(styles.item)}>
          <a
            href={resource.href}
            target="_blank"
            rel="noreferrer"
            {...stylex.props(styles.row, stylex.defaultMarker())}
          >
            <span {...stylex.props(type.labelSmall, styles.kind)}>
              {String(i + 1).padStart(2, "0")} · {resource.kind}
            </span>
            <span {...stylex.props(styles.text)}>
              <span {...stylex.props(type.body, styles.title)}>{resource.title}</span>
              <span {...stylex.props(type.small, styles.why)}>{resource.why}</span>
            </span>
            <span {...stylex.props(type.number, styles.source)}>
              {sourceOf(resource.href)}
              <span {...stylex.props(styles.arrow)}>
                <Icon icon={ArrowUpRight} size={14} />
              </span>
            </span>
          </a>
        </li>
      ))}
    </ol>
  );
}
