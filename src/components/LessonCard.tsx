"use client";

import NextLink from "next/link";
import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";
import { lessonHref, type Lesson } from "@/content/types";
import { colors, motion, radius, space } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";
import { Badge } from "@/ui/Badge";
import { useReadLessons } from "./readState";

const HOVER = "@media (hover: hover)";

const styles = stylex.create({
  card: {
    display: "flex",
    flexDirection: "column",
    gap: space.s3,
    padding: space.s3,
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
  thumb: {
    position: "relative",
    height: 140,
    overflow: "hidden",
    backgroundColor: colors.sunken,
    backgroundImage: `radial-gradient(${colors.lineStrong} 1px, transparent 1.2px)`,
    backgroundSize: "16px 16px",
    borderRadius: radius.control,
  },
  meta: { position: "absolute", top: space.s2, left: space.s3, color: colors.inkMuted },
  read: { position: "absolute", right: space.s2, bottom: space.s2 },
  diagram: { position: "absolute", inset: 0, display: "grid", placeItems: "center" },
  text: {
    display: "flex",
    flexDirection: "column",
    gap: space.s1,
    paddingInline: space.s1,
    paddingBottom: space.s1,
  },
  heading: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: space.s2,
  },
  title: {
    fontWeight: 500,
    textDecorationLine: { default: "none", [stylex.when.ancestor(":hover")]: "underline" },
    textUnderlineOffset: 3,
  },
  hook: { margin: 0, color: colors.inkSoft },
});

type LessonCardProps = {
  lesson: Pick<Lesson, "number" | "slug" | "title" | "hook" | "level" | "minutes">;
  thumbnail?: ReactNode;
};

export function LessonCard({ lesson, thumbnail }: LessonCardProps) {
  const { read } = useReadLessons();
  return (
    <NextLink href={lessonHref(lesson)} {...stylex.props(styles.card, stylex.defaultMarker())}>
      <div {...stylex.props(styles.thumb)}>
        {thumbnail && <div {...stylex.props(styles.diagram)}>{thumbnail}</div>}
        <span {...stylex.props(type.number, styles.meta)}>
          {lesson.number} · {lesson.minutes} min
        </span>
        {read.has(lesson.slug) && (
          <span {...stylex.props(styles.read)}>
            <Badge tone="read">Read</Badge>
          </span>
        )}
      </div>
      <div {...stylex.props(styles.text)}>
        <div {...stylex.props(styles.heading)}>
          <Badge level={lesson.level} />
          <span {...stylex.props(type.body, styles.title)}>{lesson.title}</span>
        </div>
        <p {...stylex.props(type.small, styles.hook)}>{lesson.hook}</p>
      </div>
    </NextLink>
  );
}

const grid = stylex.create({
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: space.s4,
  },
});

export function LessonGrid({ children }: { children: ReactNode }) {
  return <div {...stylex.props(grid.grid)}>{children}</div>;
}
