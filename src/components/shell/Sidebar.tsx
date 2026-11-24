"use client";

import * as stylex from "@stylexjs/stylex";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { lessonSlugFromPath } from "@/content/catalog";
import type { LessonSlug, TopicSlug } from "@/content/catalog";
import type { Lesson, Topic } from "@/content/types";
import { levelFilterOptions, setLevelFilter, useLevelFilter } from "@/hooks/useLevelFilter";
import type { LevelFilter } from "@/hooks/useLevelFilter";
import { useReadLessons } from "@/hooks/useReadLessons";
import { colors, radius, space } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";
import { ToggleGroup } from "@/ui/ToggleGroup";

import { SidebarHeader } from "./SidebarHeader";
import { SidebarTopic } from "./SidebarTopic";

const styles = stylex.create({
  aside: {
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    paddingInlineStart: space.s3,
    height: "100%",
    paddingBottom: space.s4,
    paddingTop: space.s4,
    width: "100%",
  },
  filter: {
    borderRadius: radius.control,
    backgroundColor: colors.sunken,
    flexShrink: 0,
    marginInlineEnd: space.s3,
    scrollbarColor: `${colors.line} transparent`,
    scrollbarWidth: "thin",
    marginBottom: space.s2,
    overflowX: "auto",
    overscrollBehaviorX: "contain",
  },
  empty: {
    margin: 0,
    paddingBlock: space.s2,
    paddingInline: 10,
    color: colors.inkMuted,
  },
  topics: {
    gap: 1,
    overscrollBehavior: "contain",
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    paddingInlineEnd: space.s3,
    scrollbarColor: `${colors.line} transparent`,
    scrollbarWidth: "thin",
    minHeight: 0,
    overflowY: "auto",
  },
  count: {
    margin: 0,
    overflow: "hidden",
    paddingInline: 10,
    color: colors.inkMuted,
    flexShrink: 0,
    marginInlineEnd: space.s3,
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    borderTopColor: colors.line,
    borderTopStyle: "solid",
    borderTopWidth: 1,
    marginTop: space.s3,
    paddingTop: space.s3,
  },
});

type SidebarProps = {
  topics: readonly Topic[];
  currentSlug?: LessonSlug;
  closable?: boolean;
};

type VisibleTopic = { topic: Topic; lessons: readonly Lesson[] };

function visibleTopics(topics: readonly Topic[], level: LevelFilter): VisibleTopic[] {
  return topics
    .map((topic) => ({
      topic,
      lessons: level === "all" ? topic.lessons : topic.lessons.filter((l) => l.level === level),
    }))
    .filter((t) => t.lessons.length > 0);
}

function countLessons(visible: readonly VisibleTopic[], read: ReadonlySet<LessonSlug>) {
  const lessons = visible.flatMap((t) => t.lessons);
  return { total: lessons.length, read: lessons.filter((l) => read.has(l.slug)).length };
}

function useOpenTopics(topics: readonly Topic[], currentSlug: LessonSlug | undefined) {
  const topicOfCurrent = topics.find((t) => t.lessons.some((l) => l.slug === currentSlug))?.slug;
  const [open, setOpen] = useState<ReadonlySet<TopicSlug>>(
    () => new Set(topicOfCurrent ? [topicOfCurrent] : []),
  );
  const [openedFor, setOpenedFor] = useState(topicOfCurrent);
  if (topicOfCurrent !== openedFor) {
    setOpenedFor(topicOfCurrent);
    if (topicOfCurrent && !open.has(topicOfCurrent)) {
      setOpen(new Set([...open, topicOfCurrent]));
    }
  }

  function toggle(slug: TopicSlug, isOpen: boolean) {
    setOpen((prev) => {
      const next = new Set(prev);
      if (isOpen) {
        next.add(slug);
      } else {
        next.delete(slug);
      }
      return next;
    });
  }

  return { open, toggle, collapseAll: () => setOpen(new Set()) };
}

export function Sidebar({ topics, currentSlug: slugProp, closable = false }: SidebarProps) {
  const { read } = useReadLessons();
  const level = useLevelFilter();
  const pathname = usePathname();
  const currentSlug = slugProp ?? lessonSlugFromPath(pathname);
  const { open, toggle, collapseAll } = useOpenTopics(topics, currentSlug);
  const visible = visibleTopics(topics, level);
  const counts = countLessons(visible, read);

  return (
    <aside aria-label="Lessons" {...stylex.props(styles.aside)}>
      <SidebarHeader canCollapse={open.size > 0} onCollapseAll={collapseAll} closable={closable} />
      <div {...stylex.props(styles.filter)}>
        <ToggleGroup
          aria-label="Filter lessons by level"
          size="small"
          options={levelFilterOptions}
          value={level}
          onValueChange={setLevelFilter}
        />
      </div>
      <nav {...stylex.props(styles.topics)}>
        {visible.length === 0 && (
          <p {...stylex.props(type.ui, styles.empty)}>No lessons at this level yet.</p>
        )}
        {visible.map(({ topic, lessons }) => (
          <SidebarTopic
            key={topic.slug}
            topic={topic}
            lessons={lessons}
            open={open.has(topic.slug)}
            onOpenChange={(next) => toggle(topic.slug, next)}
            currentSlug={currentSlug}
            read={read}
          />
        ))}
      </nav>
      <p {...stylex.props(type.tag, styles.count)}>
        {visible.length} topics · {counts.total} lessons · {counts.read} read
      </p>
    </aside>
  );
}
