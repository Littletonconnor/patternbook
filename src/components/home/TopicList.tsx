import NextLink from "next/link";
import * as stylex from "@stylexjs/stylex";
import { formatMinutes, topics, totals } from "@/content/catalog";
import { lessonHref } from "@/content/types";
import { colors, space } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";

const styles = stylex.create({
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(250px, 100%), 1fr))",
    columnGap: space.s8,
    margin: 0,
    padding: 0,
    listStyle: "none",
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: colors.line,
  },
  row: {
    display: "flex",
    alignItems: "baseline",
    gap: space.s3,
    paddingBlock: space.s4,
    color: colors.ink,
    textDecorationLine: "none",
    borderTopWidth: 1,
    borderTopStyle: "solid",
    borderTopColor: colors.line,
    outlineStyle: { default: "none", ":focus-visible": "solid" },
    outlineWidth: 2,
    outlineOffset: 2,
    outlineColor: colors.focus,
  },
  number: { flex: "0 0 20px", color: colors.inkMuted },
  text: { flexGrow: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 },
  name: {
    fontWeight: 500,
    textDecorationLine: { default: "none", [stylex.when.ancestor(":hover")]: "underline" },
    textUnderlineOffset: 3,
  },
  blurb: { color: colors.inkSoft },
  meta: { flexShrink: 0, color: colors.inkMuted, whiteSpace: "nowrap" },
});

export function TopicList() {
  return (
    <ul {...stylex.props(styles.grid)}>
      {topics.map((topic, i) => {
        const { lessons, minutes } = totals(topic.lessons);
        return (
          <li key={topic.slug}>
            <NextLink
              href={lessonHref(topic.lessons[0])}
              {...stylex.props(styles.row, stylex.defaultMarker())}
            >
              <span {...stylex.props(type.number, styles.number)}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span {...stylex.props(styles.text)}>
                <span {...stylex.props(type.body, styles.name)}>{topic.title}</span>
                <span {...stylex.props(type.small, styles.blurb)}>{topic.description}</span>
              </span>
              <span {...stylex.props(type.number, styles.meta)}>
                {lessons} · {formatMinutes(minutes)}
              </span>
            </NextLink>
          </li>
        );
      })}
    </ul>
  );
}
