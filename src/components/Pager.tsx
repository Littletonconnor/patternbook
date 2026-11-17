import NextLink from "next/link";
import * as stylex from "@stylexjs/stylex";
import { lessonHref, type Lesson } from "@/content/types";
import { colors, motion, radius, space } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";

const HOVER = "@media (hover: hover)";
const STACKED = "@media (max-width: 559px)";

const styles = stylex.create({
  pager: {
    display: "grid",
    gridTemplateColumns: { default: "1fr 1fr", [STACKED]: "1fr" },
    gap: space.s4,
  },
  card: {
    display: "flex",
    flexDirection: "column",
    gap: space.s1,
    paddingBlock: space.s4,
    paddingInline: 20,
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
  next: {
    textAlign: { default: "end", [STACKED]: "start" },
    gridColumn: { default: 2, [STACKED]: 1 },
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
