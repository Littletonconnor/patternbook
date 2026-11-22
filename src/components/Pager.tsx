import NextLink from "next/link";
import * as stylex from "@stylexjs/stylex";
import { lessonHref } from "@/content/types";
import type { Lesson } from "@/content/types";
import { colors, motion, radius, space } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";

const HOVER = "@media (hover: hover)";
const STACKED = "@media (max-width: 559px)";

const styles = stylex.create({
  pager: {
    gap: space.s4,
    display: "grid",
    gridTemplateColumns: { [STACKED]: "1fr", default: "1fr 1fr" },
  },
  card: {
    borderColor: {
      default: colors.line,
      ":hover": { [HOVER]: colors.lineStrong, default: null },
    },
    borderRadius: radius.frame,
    borderStyle: "solid",
    borderWidth: 1,
    gap: space.s1,
    paddingBlock: space.s4,
    paddingInline: 20,
    backgroundColor: colors.surface,
    color: colors.ink,
    display: "flex",
    flexDirection: "column",
    outlineColor: colors.focus,
    outlineOffset: 2,
    outlineStyle: { default: "none", ":focus-visible": "solid" },
    outlineWidth: 2,
    textDecorationLine: "none",
    transitionDuration: motion.press,
    transitionProperty: "border-color",
  },
  next: {
    gridColumn: { [STACKED]: 1, default: 2 },
    textAlign: { [STACKED]: "start", default: "end" },
  },
  direction: { color: colors.inkMuted },
  title: { fontWeight: 500 },
  hook: { color: colors.inkSoft },
});

type PagerLesson = Pick<Lesson, "number" | "slug" | "title" | "hook">;

export function Pager({ previous, next }: { previous?: PagerLesson; next?: PagerLesson }) {
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
    <NextLink
      href={lessonHref(lesson)}
      rel={isNext ? "next" : "prev"}
      {...stylex.props(styles.card, isNext && styles.next)}
    >
      <span {...stylex.props(type.labelSmall, styles.direction)}>
        {label} · {lesson.number}
      </span>
      <span {...stylex.props(type.body, styles.title)}>{lesson.title}</span>
      <span {...stylex.props(type.small, styles.hook)}>{lesson.hook}</span>
    </NextLink>
  );
}
