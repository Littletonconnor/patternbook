import * as stylex from "@stylexjs/stylex";
import { ArrowRight } from "lucide-react";

import { DiagramSketch } from "@/components/catalog/DiagramSketch";
import { diagramKinds } from "@/content/diagrams";
import { lessonHref } from "@/content/types";
import type { Diagram, Lesson } from "@/content/types";
import { colors, space } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";
import { Badge } from "@/ui/Badge";
import { CardLink } from "@/ui/CardLink";
import { Icon } from "@/ui/Icon";

const styles = stylex.create({
  stage: {
    placeItems: "center",
    backgroundColor: colors.sunken,
    backgroundImage: `radial-gradient(${colors.lineStrong} 1px, transparent 1.2px)`,
    backgroundSize: "16px 16px",
    display: "grid",
    position: "relative",
    height: 160,
    paddingTop: space.s3,
  },
  number: { color: colors.inkMuted, position: "absolute", left: space.s3, top: 10 },
  kind: { position: "absolute", right: space.s3, top: space.s2 },
  text: {
    gap: 6,
    paddingInline: 18,
    display: "flex",
    flexDirection: "column",
    borderTopColor: colors.line,
    borderTopStyle: "solid",
    borderTopWidth: 1,
    paddingBottom: 18,
    paddingTop: space.s4,
  },
  title: {
    fontWeight: 500,
    textDecorationLine: { default: "none", [stylex.when.ancestor(":hover")]: "underline" },
    textUnderlineOffset: 3,
  },
  lesson: {
    gap: space.s3,
    alignItems: "center",
    color: colors.inkSoft,
    display: "flex",
    justifyContent: "space-between",
  },
  lessonNumber: { color: colors.inkMuted, marginInlineEnd: space.s2 },
});

type DiagramCardProps = {
  diagram: Diagram;
  lesson: Pick<Lesson, "number" | "slug" | "title">;
};

export function DiagramCard({ diagram, lesson }: DiagramCardProps) {
  return (
    <CardLink href={lessonHref(lesson)} padding="none">
      <div {...stylex.props(styles.stage)}>
        <span {...stylex.props(type.labelSmall, styles.number)}>Diagram {diagram.number}</span>
        <span {...stylex.props(styles.kind)}>
          <Badge tone="kind">{diagramKinds[diagram.kind]}</Badge>
        </span>
        <DiagramSketch kind={diagram.kind} />
      </div>
      <div {...stylex.props(styles.text)}>
        <span {...stylex.props(type.body, styles.title)}>{diagram.title}</span>
        <span {...stylex.props(type.ui, styles.lesson)}>
          <span>
            <span {...stylex.props(type.number, styles.lessonNumber)}>
              {String(lesson.number).padStart(2, "0")}
            </span>
            {lesson.title}
          </span>
          <Icon icon={ArrowRight} size={14} />
        </span>
      </div>
    </CardLink>
  );
}
