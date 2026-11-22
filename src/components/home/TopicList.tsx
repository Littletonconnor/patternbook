import NextLink from "next/link";
import * as stylex from "@stylexjs/stylex";
import { formatMinutes, topics, totals } from "@/content/catalog";
import { lessonHref } from "@/content/types";
import { colors, space } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";

const styles = stylex.create({
  grid: {
    margin: 0,
    padding: 0,
    listStyle: "none",
    columnGap: space.s8,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(250px, 100%), 1fr))",
    borderBottomColor: colors.line,
    borderBottomStyle: "solid",
    borderBottomWidth: 1,
  },
  row: {
    gap: space.s3,
    paddingBlock: space.s4,
    alignItems: "baseline",
    color: colors.ink,
    display: "flex",
    outlineColor: colors.focus,
    outlineOffset: 2,
    outlineStyle: { default: "none", ":focus-visible": "solid" },
    outlineWidth: 2,
    textDecorationLine: "none",
    borderTopColor: colors.line,
    borderTopStyle: "solid",
    borderTopWidth: 1,
  },
  number: { color: colors.inkMuted, flexBasis: "20px", flexGrow: "0", flexShrink: "0" },
  text: { gap: 2, display: "flex", flexDirection: "column", flexGrow: 1, minWidth: 0 },
  name: {
    fontWeight: 500,
    textDecorationLine: { default: "none", [stylex.when.ancestor(":hover")]: "underline" },
    textUnderlineOffset: 3,
  },
  blurb: { color: colors.inkSoft },
  meta: { color: colors.inkMuted, flexShrink: 0, whiteSpace: "nowrap" },
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
