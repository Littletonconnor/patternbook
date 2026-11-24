import * as stylex from "@stylexjs/stylex";

import { lessonHref } from "@/content/types";
import type { Lesson } from "@/content/types";
import { colors, space } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";
import { CardLink } from "@/ui/CardLink";

const STACKED = "@media (max-width: 559px)";

const styles = stylex.create({
  pager: {
    gap: space.s4,
    display: "grid",
    gridTemplateColumns: { [STACKED]: "1fr", default: "1fr 1fr" },
  },
  next: {
    gridColumn: { [STACKED]: 1, default: 2 },
    textAlign: { [STACKED]: "start", default: "end" },
  },
  body: { gap: space.s1, display: "flex", flexDirection: "column" },
  direction: { color: colors.inkMuted },
  title: { fontWeight: 500 },
  hook: { color: colors.inkSoft },
});

type PagerLesson = Pick<Lesson, "number" | "slug" | "title" | "hook">;

export function Pager({
  previous,
  next,
}: {
  previous: PagerLesson | undefined;
  next: PagerLesson | undefined;
}) {
  return (
    <nav aria-label="Lessons" {...stylex.props(styles.pager)}>
      {previous && <PagerCard lesson={previous} label="Previous" />}
      {next && <PagerCard lesson={next} label="Next" isNext />}
    </nav>
  );
}

function PagerCard({
  lesson,
  label,
  isNext = false,
}: {
  lesson: PagerLesson;
  label: string;
  isNext?: boolean;
}) {
  return (
    <div {...stylex.props(isNext && styles.next)}>
      <CardLink href={lessonHref(lesson)} rel={isNext ? "next" : "prev"}>
        <span {...stylex.props(styles.body)}>
          <span {...stylex.props(type.labelSmall, styles.direction)}>
            {label} · {lesson.number}
          </span>
          <span {...stylex.props(type.body, styles.title)}>{lesson.title}</span>
          <span {...stylex.props(type.small, styles.hook)}>{lesson.hook}</span>
        </span>
      </CardLink>
    </div>
  );
}
