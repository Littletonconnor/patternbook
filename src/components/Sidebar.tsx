"use client";

import NextLink from "next/link";
import * as stylex from "@stylexjs/stylex";
import { Check } from "lucide-react";
import { useState } from "react";
import { lessonHref, type Topic } from "@/content/types";
import { colors, fonts, measure, space } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";
import { Badge } from "@/ui/Badge";
import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "@/ui/Collapsible";
import { Icon } from "@/ui/Icon";
import { useReadLessons } from "./readState";

const HOVER = "@media (hover: hover)";

const styles = stylex.create({
  aside: {
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    gap: space.s4,
    width: `calc(${measure.sidebar} + 28px)`,
    paddingTop: 20,
    paddingInlineEnd: space.s3,
    paddingBottom: space.s6,
    paddingInlineStart: space.s4,
    borderRightWidth: 1,
    borderRightStyle: "solid",
    borderRightColor: colors.line,
  },
  topics: { display: "flex", flexDirection: "column", gap: 2 },
  lessons: { display: "flex", flexDirection: "column", gap: 2, paddingBlock: space.s1 },
  row: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    paddingBlock: 6,
    paddingInline: 10,
    borderRadius: 6,
    textDecorationLine: "none",
    color: colors.inkSoft,
    backgroundColor: "transparent",
    outlineStyle: { default: "none", ":focus-visible": "solid" },
    outlineWidth: 2,
    outlineOffset: -2,
    outlineColor: colors.focus,
  },
  rowLink: {
    color: { default: colors.inkSoft, ":hover": { default: null, [HOVER]: colors.ink } },
    backgroundColor: {
      default: "transparent",
      ":hover": { default: null, [HOVER]: colors.sunken },
    },
  },
  current: {
    color: { default: colors.ink, ":hover": colors.ink },
    backgroundColor: { default: colors.line, ":hover": colors.line },
    fontWeight: 500,
  },
  planned: { color: colors.inkMuted },
  number: { fontFamily: fonts.mono, color: colors.inkMuted, minWidth: 16 },
  title: { flexGrow: 1, minWidth: 0 },
  tick: { display: "inline-flex", color: colors.sound },
  count: { margin: 0, color: colors.inkMuted },
});

type SidebarProps = {
  topics: readonly Topic[];
  currentSlug?: string;
};

export function Sidebar({ topics, currentSlug }: SidebarProps) {
  const { read } = useReadLessons();
  const [open, setOpen] = useState<ReadonlySet<string>>(
    () =>
      new Set(
        topics.filter((t) => t.lessons.some((l) => l.slug === currentSlug)).map((t) => t.slug),
      ),
  );

  const lessonCount = topics.reduce((sum, t) => sum + t.lessons.length, 0);
  const readCount = topics.reduce(
    (sum, t) => sum + t.lessons.filter((l) => read.has(l.slug)).length,
    0,
  );

  function toggle(slug: string, isOpen: boolean) {
    setOpen((prev) => {
      const next = new Set(prev);
      if (isOpen) next.add(slug);
      else next.delete(slug);
      return next;
    });
  }

  return (
    <aside aria-label="Lessons" {...stylex.props(styles.aside)}>
      <nav {...stylex.props(styles.topics)}>
        {topics.map((topic) => {
          const isOpen = open.has(topic.slug);
          const readHere = topic.lessons.filter((l) => read.has(l.slug)).length;
          return (
            <Collapsible
              key={topic.slug}
              open={isOpen}
              onOpenChange={(next) => toggle(topic.slug, next)}
            >
              <CollapsibleTrigger
                meta={isOpen ? `${readHere}/${topic.lessons.length}` : topic.lessons.length}
              >
                {topic.title}
              </CollapsibleTrigger>
              <CollapsiblePanel>
                <div {...stylex.props(styles.lessons)}>
                  {topic.lessons.map((lesson) => {
                    const number = (
                      <span {...stylex.props(type.number, styles.number)}>{lesson.number}</span>
                    );
                    if (lesson.status === "planned") {
                      return (
                        <span
                          key={lesson.slug}
                          {...stylex.props(type.ui, styles.row, styles.planned)}
                        >
                          {number}
                          <span {...stylex.props(styles.title)}>{lesson.title}</span>
                          <Badge>Soon</Badge>
                        </span>
                      );
                    }
                    const isCurrent = lesson.slug === currentSlug;
                    return (
                      <NextLink
                        key={lesson.slug}
                        href={lessonHref(lesson)}
                        aria-current={isCurrent ? "page" : undefined}
                        {...stylex.props(
                          type.ui,
                          styles.row,
                          styles.rowLink,
                          isCurrent && styles.current,
                        )}
                      >
                        {number}
                        <span {...stylex.props(styles.title)}>{lesson.title}</span>
                        {read.has(lesson.slug) && (
                          <span {...stylex.props(styles.tick)}>
                            <Icon icon={Check} size={14} label="Read" />
                          </span>
                        )}
                      </NextLink>
                    );
                  })}
                </div>
              </CollapsiblePanel>
            </Collapsible>
          );
        })}
      </nav>
      <p {...stylex.props(type.tag, styles.count)}>
        {topics.length} topics · {lessonCount} lessons · {readCount} read
      </p>
    </aside>
  );
}
