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
    listStyle: "none",
    overflow: "hidden",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors.line,
    borderRadius: radius.frame,
  },
  item: {
    borderTopWidth: { default: 1, ":first-child": 0 },
    borderTopStyle: "solid",
    borderTopColor: colors.line,
  },
  row: {
    display: "grid",
    gridTemplateColumns: { default: "104px minmax(0, 1fr) auto", [NARROW]: "1fr" },
    alignItems: "baseline",
    gap: { default: 20, [NARROW]: space.s1 },
    paddingBlock: space.s4,
    paddingInline: 18,
    color: colors.ink,
    textDecorationLine: "none",
    backgroundColor: {
      default: "transparent",
      ":hover": { default: null, [HOVER]: colors.paper },
    },
    transitionProperty: "background-color",
    transitionDuration: motion.press,
    outlineStyle: { default: "none", ":focus-visible": "solid" },
    outlineWidth: 2,
    outlineOffset: -2,
    outlineColor: colors.focus,
  },
  kind: { color: colors.inkMuted },
  text: { display: "flex", flexDirection: "column", gap: 2 },
  title: {
    fontWeight: 500,
    textDecorationLine: { default: "none", [stylex.when.ancestor(":hover")]: "underline" },
    textUnderlineOffset: 3,
  },
  why: { color: colors.inkSoft },
  source: { display: "inline-flex", alignItems: "center", gap: 2, color: colors.inkMuted },
  arrow: {
    display: "inline-flex",
    color: { default: colors.inkMuted, [stylex.when.ancestor(":hover")]: colors.signal },
    transform: { default: null, [stylex.when.ancestor(":hover")]: "translate(2px, -2px)" },
    transitionProperty: "color, transform",
    transitionDuration: motion.press,
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
