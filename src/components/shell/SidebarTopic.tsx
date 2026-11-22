import * as stylex from "@stylexjs/stylex";
import {
  Binary,
  Braces,
  Container,
  Database,
  FileText,
  FlaskConical,
  Gauge,
  GitBranch,
  Globe,
  MousePointerClick,
  Network,
  PanelsTopLeft,
  Radio,
  RefreshCcwDot,
  Rocket,
  ShieldCheck,
  SquareTerminal,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Lesson, Topic } from "@/content/types";
import { colors, space } from "@/tokens/tokens.stylex";
import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "@/ui/Collapsible";
import { Icon } from "@/ui/Icon";
import { SidebarLessonRow } from "./SidebarLessonRow";

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
  topicIcon: {
    color: { default: colors.inkMuted, [stylex.when.ancestor(OPEN)]: colors.ink },
    display: "inline-flex",
    flexShrink: 0,
  },
  truncate: {
    overflow: "hidden",
    flexGrow: 1,
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    minWidth: 0,
  },
  lessons: {
    gap: 1,
    display: "flex",
    flexDirection: "column",
    paddingInlineStart: 20,
    paddingBottom: space.s2,
    paddingTop: 1,
  },
});

type SidebarTopicProps = {
  topic: Topic;
  lessons: readonly Lesson[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentSlug: string | undefined;
  read: ReadonlySet<string>;
};

export function SidebarTopic({
  topic,
  lessons,
  open,
  onOpenChange,
  currentSlug,
  read,
}: SidebarTopicProps) {
  const readHere = lessons.filter((lesson) => read.has(lesson.slug)).length;
  return (
    <Collapsible open={open} onOpenChange={onOpenChange}>
      <CollapsibleTrigger meta={open ? `${readHere}/${lessons.length}` : undefined}>
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
            <SidebarLessonRow
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
}
