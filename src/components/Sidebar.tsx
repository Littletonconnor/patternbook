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
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { lessonHref, type Lesson, type Topic } from "@/content/types";
import { colors, motion, space } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";
import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "@/ui/Collapsible";
import { Icon } from "@/ui/Icon";
import { Tooltip } from "@/ui/Tooltip";
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
    width: "100%",
    height: "100%",
    paddingTop: space.s4,
    paddingBottom: space.s4,
    paddingInlineStart: space.s3,
  },
  head: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexShrink: 0,
    height: 28,
    marginBottom: space.s1,
    paddingInlineStart: 10,
    paddingInlineEnd: space.s3,
    color: colors.inkMuted,
  },
  actions: { display: "flex", alignItems: "center", gap: 2 },
  collapseAll: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 24,
    height: 24,
    padding: 0,
    borderWidth: 0,
    borderRadius: 6,
    cursor: "pointer",
    color: { default: colors.inkMuted, ":hover": { default: null, [HOVER]: colors.ink } },
    backgroundColor: {
      default: "transparent",
      ":hover": { default: null, [HOVER]: colors.sunken },
    },
    opacity: { default: 1, ":disabled": 0.4 },
    outlineStyle: { default: "none", ":focus-visible": "solid" },
    outlineWidth: 2,
    outlineOffset: -2,
    outlineColor: colors.focus,
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
    gap: 1,
  },
  truncate: {
    flexGrow: 1,
    minWidth: 0,
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
  topicIcon: {
    display: "inline-flex",
    flexShrink: 0,
    color: { default: colors.inkMuted, [stylex.when.ancestor(OPEN)]: colors.ink },
  },
  lessons: {
    display: "flex",
    flexDirection: "column",
    gap: 1,
    paddingTop: 1,
    paddingBottom: space.s2,
    paddingInlineStart: 20,
  },
  row: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    height: 30,
    paddingInline: 10,
    borderRadius: 6,
    textDecorationLine: "none",
    color: colors.inkSoft,
    backgroundColor: "transparent",
    outlineStyle: { default: "none", ":focus-visible": "solid" },
    outlineWidth: 2,
    outlineOffset: -2,
    outlineColor: colors.focus,
    transitionProperty: "background-color, color",
    transitionDuration: motion.press,
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
  lessonIcon: { display: "inline-flex", flexShrink: 0, color: colors.inkMuted },
  lessonIconCurrent: { color: colors.ink },
  lessonIconRead: { color: colors.sound },
  count: {
    flexShrink: 0,
    margin: 0,
    marginTop: space.s3,
    marginInlineEnd: space.s3,
    paddingTop: space.s3,
    paddingInline: 10,
    color: colors.inkMuted,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    borderTopWidth: 1,
    borderTopStyle: "solid",
    borderTopColor: colors.line,
  },
});

type SidebarProps = {
  topics: readonly Topic[];
  currentSlug?: string;
  closable?: boolean;
};

export function Sidebar({ topics, currentSlug: slugProp, closable = false }: SidebarProps) {
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
              <CollapsibleTrigger meta={isOpen ? `${readHere}/${topic.lessons.length}` : undefined}>
                <span {...stylex.props(styles.topicIcon)}>
                  <Icon icon={topicIcons[topic.slug] ?? FileText} />
                </span>
                <span title={topic.title} {...stylex.props(styles.truncate)}>
                  {topic.title}
                </span>
              </CollapsibleTrigger>
              <CollapsiblePanel>
                <div {...stylex.props(styles.lessons)}>
                  {topic.lessons.map((lesson) => (
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
        {topics.length} topics · {lessonCount} lessons · {readCount} read
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
