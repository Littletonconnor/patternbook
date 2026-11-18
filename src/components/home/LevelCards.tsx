import NextLink from "next/link";
import * as stylex from "@stylexjs/stylex";
import { formatMinutes, lessons, lessonsByLevel, totals } from "@/content/catalog";
import { lessonHref, type Level } from "@/content/types";
import { colors, motion, radius, space } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";
import { Badge } from "@/ui/Badge";

const HOVER = "@media (hover: hover)";

const levels: { level: Level; blurb: string }[] = [
  { level: "foundations", blurb: "How the web, the terminal, Git and the browser actually work." },
  { level: "core", blurb: "The everyday patterns: client data, APIs, databases, auth, testing." },
  {
    level: "advanced",
    blurb: "Performance, reliability at scale, real-time and running in production.",
  },
];

const styles = stylex.create({
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))",
    gap: space.s4,
  },
  card: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
    padding: 20,
    color: colors.ink,
    textDecorationLine: "none",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: {
      default: colors.line,
      ":hover": { default: null, [HOVER]: colors.lineStrong },
    },
    borderRadius: radius.frame,
    transitionProperty: "border-color",
    transitionDuration: motion.press,
    outlineStyle: { default: "none", ":focus-visible": "solid" },
    outlineWidth: 2,
    outlineOffset: 2,
    outlineColor: colors.focus,
  },
  top: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: space.s3 },
  meta: { color: colors.inkMuted },
  blurb: { color: colors.inkSoft },
  bar: { display: "flex", gap: 3, height: 6 },
  segment: { borderRadius: 3, backgroundColor: colors.line },
  active: { backgroundColor: colors.ink },
});

const segment = stylex.create({
  grow: (count: number) => ({ flexGrow: count }),
});

export function LevelCards() {
  const counts = levels.map(({ level }) => lessonsByLevel(level).length);

  return (
    <div {...stylex.props(styles.grid)}>
      {levels.map(({ level, blurb }) => {
        const list = lessonsByLevel(level);
        const { minutes } = totals(list);
        return (
          <NextLink
            key={level}
            href={lessonHref(list[0] ?? lessons[0])}
            {...stylex.props(styles.card)}
          >
            <span {...stylex.props(styles.top)}>
              <Badge level={level} />
              <span {...stylex.props(type.number, styles.meta)}>
                {list.length} lessons · {formatMinutes(minutes)}
              </span>
            </span>
            <span {...stylex.props(type.small, styles.blurb)}>{blurb}</span>
            <span aria-hidden="true" {...stylex.props(styles.bar)}>
              {levels.map((other, i) => (
                <span
                  key={other.level}
                  {...stylex.props(
                    styles.segment,
                    segment.grow(counts[i]),
                    other.level === level && styles.active,
                  )}
                />
              ))}
            </span>
          </NextLink>
        );
      })}
    </div>
  );
}
