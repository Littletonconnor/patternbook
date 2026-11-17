"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import * as stylex from "@stylexjs/stylex";
import { Check } from "lucide-react";
import { useState } from "react";
import { lessonHref, type Topic } from "@/content/types";
import { colors, fonts, space } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";
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
    width: "100%",
    height: "100%",
    paddingTop: 20,
    paddingInlineEnd: 0,
    paddingBottom: space.s6,
    paddingInlineStart: space.s4,
  },
  topics: {
    flexGrow: 1,
    minHeight: 0,
    overflowY: "auto",
    overscrollBehavior: "contain",
    paddingInlineEnd: space.s3,
    scrollbarWidth: "thin",
    scrollbarColor: `${colors.line} transparent`,
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  lessons: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    marginTop: 2,
    marginBottom: 6,
    marginInlineStart: 15,
    paddingInlineStart: 5,
    borderLeftWidth: 1,
    borderLeftStyle: "solid",
    borderLeftColor: colors.line,
  },
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
  count: {
    flexShrink: 0,
    margin: 0,
    marginInlineEnd: space.s3,
    paddingTop: space.s3,
    paddingInline: 10,
    color: colors.inkMuted,
    borderTopWidth: 1,
    borderTopStyle: "solid",
    borderTopColor: colors.line,
  },
});

type SidebarProps = {
  topics: readonly Topic[];
  currentSlug?: string;
};

export function Sidebar({ topics, currentSlug: slugProp }: SidebarProps) {
  const { read } = useReadLessons();
  const pathname = usePathname();
  const currentSlug = slugProp ?? pathname.match(/^\/lessons\/([^/]+)/)?.[1];
  const topicOfCurrent = topics.find((t) => t.lessons.some((l) => l.slug === currentSlug))?.slug;

  const [open, setOpen] = useState<ReadonlySet<string>>(
    () => new Set(topicOfCurrent ? [topicOfCurrent] : []),
  );
  const [openedFor, setOpenedFor] = useState(topicOfCurrent);
  if (topicOfCurrent !== openedFor) {
    setOpenedFor(topicOfCurrent);
    if (topicOfCurrent && !open.has(topicOfCurrent)) setOpen(new Set([...open, topicOfCurrent]));
  }

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
                    const isCurrent = lesson.slug === currentSlug;
                    if (lesson.status === "planned") {
                      return (
                        <span
                          key={lesson.slug}
                          aria-current={isCurrent ? "page" : undefined}
                          {...stylex.props(
                            type.ui,
                            styles.row,
                            styles.planned,
                            isCurrent && styles.current,
                          )}
                        >
                          {number}
                          <span {...stylex.props(styles.title)}>{lesson.title}</span>
                        </span>
                      );
                    }
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
