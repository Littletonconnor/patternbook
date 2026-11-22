"use client";

import NextLink from "next/link";
import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";
import { lessonHref } from "@/content/types";
import type { Lesson } from "@/content/types";
import { colors, motion, radius, space } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";
import { Badge } from "@/ui/Badge";
import { useReadLessons } from "./readState";

const HOVER = "@media (hover: hover)";

const styles = stylex.create({
  card: {
    padding: space.s3,
    borderColor: {
      default: colors.line,
      ":hover": { [HOVER]: colors.lineStrong, default: null },
    },
    borderRadius: radius.frame,
    borderStyle: "solid",
    borderWidth: 1,
    gap: space.s3,
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
  thumb: {
    borderRadius: radius.control,
    overflow: "hidden",
    backgroundColor: colors.sunken,
    backgroundImage: `radial-gradient(${colors.lineStrong} 1px, transparent 1.2px)`,
    backgroundSize: "16px 16px",
    position: "relative",
    height: 140,
  },
  meta: { color: colors.inkMuted, position: "absolute", left: space.s3, top: space.s2 },
  read: { position: "absolute", bottom: space.s2, right: space.s2 },
  diagram: { inset: 0, placeItems: "center", display: "grid", position: "absolute" },
  text: {
    gap: space.s1,
    paddingInline: space.s1,
    display: "flex",
    flexDirection: "column",
    paddingBottom: space.s1,
  },
  heading: {
    gap: space.s2,
    alignItems: "flex-start",
    display: "flex",
    flexDirection: "column",
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
    gap: space.s4,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
  },
});

export function LessonGrid({ children }: { children: ReactNode }) {
  return <div {...stylex.props(grid.grid)}>{children}</div>;
}
