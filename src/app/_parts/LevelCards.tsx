import * as stylex from "@stylexjs/stylex";

import { formatMinutes, lessons, lessonsByLevel, totals } from "@/content/catalog";
import { lessonHref } from "@/content/types";
import type { Level } from "@/content/types";
import { colors, space } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";
import { Badge } from "@/ui/Badge";
import { CardLink } from "@/ui/CardLink";

const levels: { level: Level; blurb: string }[] = [
  { level: "foundations", blurb: "How HTTP, the browser, the shell and Git work." },
  { level: "core", blurb: "Client data, APIs, databases, auth and testing." },
  {
    level: "advanced",
    blurb: "Performance, reliability at scale, real-time systems and production operations.",
  },
];

const styles = stylex.create({
  body: { gap: space.s3, display: "flex", flexDirection: "column", flexGrow: 1 },
  grid: {
    gap: space.s4,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))",
  },
  top: { gap: space.s3, alignItems: "center", display: "flex", justifyContent: "space-between" },
  meta: { color: colors.inkMuted },
  blurb: { color: colors.inkSoft },
  bar: { gap: 3, display: "flex", height: 6 },
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
          <CardLink key={level} href={lessonHref(list[0] ?? lessons[0])}>
            <span {...stylex.props(styles.body)}>
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
            </span>
          </CardLink>
        );
      })}
    </div>
  );
}
