"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import * as stylex from "@stylexjs/stylex";
import {
  Binary,
  Braces,
  ChevronsDownUp,
  CircleCheck,
  Container,
  Database,
  FileText,
  FlaskConical,
  Gauge,
  GitBranch,
  Globe,
  MousePointerClick,
  Network,
  PanelLeftClose,
  PanelsTopLeft,
  Radio,
  RefreshCcwDot,
  Rocket,
  ShieldCheck,
  SquareTerminal,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";
import { lessonHref } from "@/content/types";
import type { Lesson, Topic } from "@/content/types";
import { colors, motion, radius, space } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";
import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "@/ui/Collapsible";
import { Icon } from "@/ui/Icon";
import { ToggleGroup } from "@/ui/ToggleGroup";
import { Tooltip } from "@/ui/Tooltip";
import { levelFilterOptions, setLevelFilter, useLevelFilter } from "./levelFilter";
import { useReadLessons } from "./readState";
import { toggleSidebar } from "./sidebarState";

const HOVER = "@media (hover: hover)";
const OPEN = ":is([data-panel-open])";

const topicIcons: Record<string, LucideIcon> = {
  "how-the-web-works": Globe,
  "the-terminal-and-linux": SquareTerminal,
  git: GitBranch,
  "frontend-and-ui": PanelsTopLeft,
  "data-on-the-client": RefreshCcwDot,
  apis: Braces,
  databases: Database,
  "tricky-data": Binary,
  "auth-and-security": ShieldCheck,
  performance: Gauge,
  "reliability-and-scale": Network,
  "real-time": Radio,
  testing: FlaskConical,
  docker: Container,
  "shipping-and-operations": Rocket,
  "interactive-explainers": MousePointerClick,
};

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
  head: {
    alignItems: "center",
    color: colors.inkMuted,
    display: "flex",
    flexShrink: 0,
    justifyContent: "space-between",
    paddingInlineEnd: space.s3,
    paddingInlineStart: 10,
    height: 28,
    marginBottom: space.s1,
  },
  actions: { gap: 2, alignItems: "center", display: "flex" },
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
  collapseAll: {
    padding: 0,
    borderRadius: 6,
    borderWidth: 0,
    alignItems: "center",
    backgroundColor: {
      default: "transparent",
      ":hover": { [HOVER]: colors.sunken, default: null },
    },
    color: { default: colors.inkMuted, ":hover": { [HOVER]: colors.ink, default: null } },
    cursor: "pointer",
    display: "inline-flex",
    justifyContent: "center",
    opacity: { default: 1, ":disabled": 0.4 },
    outlineColor: colors.focus,
    outlineOffset: -2,
    outlineStyle: { default: "none", ":focus-visible": "solid" },
    outlineWidth: 2,
    height: 24,
    width: 24,
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
  truncate: {
    overflow: "hidden",
    flexGrow: 1,
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    minWidth: 0,
  },
  topicIcon: {
    color: { default: colors.inkMuted, [stylex.when.ancestor(OPEN)]: colors.ink },
    display: "inline-flex",
    flexShrink: 0,
  },
  lessons: {
    gap: 1,
    display: "flex",
    flexDirection: "column",
    paddingInlineStart: 20,
    paddingBottom: space.s2,
    paddingTop: 1,
  },
  row: {
    borderRadius: 6,
    gap: 10,
    paddingInline: 10,
    alignItems: "center",
    backgroundColor: "transparent",
    color: colors.inkSoft,
    display: "flex",
    outlineColor: colors.focus,
    outlineOffset: -2,
    outlineStyle: { default: "none", ":focus-visible": "solid" },
    outlineWidth: 2,
    textDecorationLine: "none",
    transitionDuration: motion.press,
    transitionProperty: "background-color, color",
    height: 30,
  },
  rowLink: {
    backgroundColor: {
      default: "transparent",
      ":hover": { [HOVER]: colors.sunken, default: null },
    },
    color: { default: colors.inkSoft, ":hover": { [HOVER]: colors.ink, default: null } },
  },
  current: {
    backgroundColor: { default: colors.line, ":hover": colors.line },
    color: { default: colors.ink, ":hover": colors.ink },
    fontWeight: 500,
  },
  planned: { color: colors.inkMuted },
  lessonIcon: { color: colors.inkMuted, display: "inline-flex", flexShrink: 0 },
  lessonIconCurrent: { color: colors.ink },
  lessonIconRead: { color: colors.sound },
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
  currentSlug?: string;
  closable?: boolean;
};

export function Sidebar({ topics, currentSlug: slugProp, closable = false }: SidebarProps) {
  const { read } = useReadLessons();
  const level = useLevelFilter();
  const pathname = usePathname();
  const currentSlug = slugProp ?? pathname.match(/^\/lessons\/([^/]+)/)?.[1];
  const topicOfCurrent = topics.find((t) => t.lessons.some((l) => l.slug === currentSlug))?.slug;

  const [open, setOpen] = useState<ReadonlySet<string>>(
    () => new Set(topicOfCurrent ? [topicOfCurrent] : []),
  );
  const [openedFor, setOpenedFor] = useState(topicOfCurrent);
  if (topicOfCurrent !== openedFor) {
    setOpenedFor(topicOfCurrent);
    if (topicOfCurrent && !open.has(topicOfCurrent)) {
      setOpen(new Set([...open, topicOfCurrent]));
    }
  }

  const visible = topics
    .map((topic) => ({
      topic,
      lessons: level === "all" ? topic.lessons : topic.lessons.filter((l) => l.level === level),
    }))
    .filter((t) => t.lessons.length > 0);

  const lessonCount = visible.reduce((sum, t) => sum + t.lessons.length, 0);
  const readCount = visible.reduce(
    (sum, t) => sum + t.lessons.filter((l) => read.has(l.slug)).length,
    0,
  );

  function toggle(slug: string, isOpen: boolean) {
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

  return (
    <aside aria-label="Lessons" {...stylex.props(styles.aside)}>
      <div {...stylex.props(styles.head)}>
        <span {...stylex.props(type.labelSmall)}>Topics</span>
        <div {...stylex.props(styles.actions)}>
          <Tooltip label="Collapse all topics">
            <button
              type="button"
              aria-label="Collapse all topics"
              disabled={open.size === 0}
              onClick={() => setOpen(new Set())}
              {...stylex.props(styles.collapseAll)}
            >
              <Icon icon={ChevronsDownUp} size={14} />
            </button>
          </Tooltip>
          {closable && (
            <Tooltip label="Hide sidebar" shortcut="⌘\">
              <button
                type="button"
                aria-label="Hide sidebar"
                aria-controls="lesson-sidebar"
                onClick={toggleSidebar}
                {...stylex.props(styles.collapseAll)}
              >
                <Icon icon={PanelLeftClose} size={14} />
              </button>
            </Tooltip>
          )}
        </div>
      </div>
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
        {visible.map(({ topic, lessons }) => {
          const isOpen = open.has(topic.slug);
          const readHere = lessons.filter((l) => read.has(l.slug)).length;
          return (
            <Collapsible
              key={topic.slug}
              open={isOpen}
              onOpenChange={(next) => toggle(topic.slug, next)}
            >
              <CollapsibleTrigger meta={isOpen ? `${readHere}/${lessons.length}` : undefined}>
                <span {...stylex.props(styles.topicIcon)}>
                  <Icon icon={topicIcons[topic.slug] ?? FileText} />
                </span>
                <span title={topic.title} {...stylex.props(styles.truncate)}>
                  {topic.title}
                </span>
              </CollapsibleTrigger>
              <CollapsiblePanel>
                <div {...stylex.props(styles.lessons)}>
                  {lessons.map((lesson) => (
                    <LessonRow
                      key={lesson.slug}
                      lesson={lesson}
                      isCurrent={lesson.slug === currentSlug}
                      isRead={read.has(lesson.slug)}
                    />
                  ))}
                </div>
              </CollapsiblePanel>
            </Collapsible>
          );
        })}
      </nav>
      <p {...stylex.props(type.tag, styles.count)}>
        {visible.length} topics · {lessonCount} lessons · {readCount} read
      </p>
    </aside>
  );
}

type LessonRowProps = { lesson: Lesson; isCurrent: boolean; isRead: boolean };

function LessonRow({ lesson, isCurrent, isRead }: LessonRowProps) {
  const planned = lesson.status === "planned";
  const glyph = isRead ? CircleCheck : FileText;
  const contents = (
    <>
      <span
        {...stylex.props(
          styles.lessonIcon,
          isCurrent && styles.lessonIconCurrent,
          isRead && styles.lessonIconRead,
        )}
      >
        <Icon icon={glyph} size={14} label={isRead ? "Read" : undefined} />
      </span>
      <span title={lesson.title} {...stylex.props(styles.truncate)}>
        {lesson.title}
      </span>
    </>
  );

  if (planned) {
    return (
      <span
        aria-current={isCurrent ? "page" : undefined}
        {...stylex.props(type.ui, styles.row, styles.planned, isCurrent && styles.current)}
      >
        {contents}
      </span>
    );
  }
  return (
    <NextLink
      href={lessonHref(lesson)}
      aria-current={isCurrent ? "page" : undefined}
      {...stylex.props(type.ui, styles.row, styles.rowLink, isCurrent && styles.current)}
    >
      {contents}
    </NextLink>
  );
}
