import * as stylex from "@stylexjs/stylex";
import { CircleCheck, FileText } from "lucide-react";
import { lessonHref } from "@/content/types";
import type { Lesson } from "@/content/types";
import { colors, motion } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";
import { Icon } from "@/ui/Icon";
import { RowLink } from "@/ui/RowLink";

const styles = stylex.create({
  truncate: {
    overflow: "hidden",
    flexGrow: 1,
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    minWidth: 0,
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
  current: {
    backgroundColor: { default: colors.line, ":hover": colors.line },
    color: { default: colors.ink, ":hover": colors.ink },
    fontWeight: 500,
  },
  planned: { color: colors.inkMuted },
  lessonIcon: { color: colors.inkMuted, display: "inline-flex", flexShrink: 0 },
  lessonIconCurrent: { color: colors.ink },
  lessonIconRead: { color: colors.sound },
});

type SidebarLessonRowProps = { lesson: Lesson; isCurrent: boolean; isRead: boolean };

export function SidebarLessonRow({ lesson, isCurrent, isRead }: SidebarLessonRowProps) {
  const contents = (
    <>
      <span
        {...stylex.props(
          styles.lessonIcon,
          isCurrent && styles.lessonIconCurrent,
          isRead && styles.lessonIconRead,
        )}
      >
        <Icon
          icon={isRead ? CircleCheck : FileText}
          size={14}
          label={isRead ? "Read" : undefined}
        />
      </span>
      <span title={lesson.title} {...stylex.props(styles.truncate)}>
        {lesson.title}
      </span>
    </>
  );

  if (lesson.status === "planned") {
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
    <RowLink href={lessonHref(lesson)} size="compact" current={isCurrent}>
      {contents}
    </RowLink>
  );
}
