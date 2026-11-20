import NextLink from "next/link";
import * as stylex from "@stylexjs/stylex";
import { ArrowRight } from "lucide-react";
import { diagramKinds } from "@/content/diagrams";
import { lessonHref, type Diagram, type Lesson } from "@/content/types";
import { colors, motion, radius, space } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";
import { Badge } from "@/ui/Badge";
import { Icon } from "@/ui/Icon";
import { DiagramSketch } from "./DiagramSketch";

const HOVER = "@media (hover: hover)";

const styles = stylex.create({
  card: {
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
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
  stage: {
    position: "relative",
    height: 160,
    display: "grid",
    placeItems: "center",
    paddingTop: space.s3,
    backgroundColor: colors.sunken,
    backgroundImage: `radial-gradient(${colors.lineStrong} 1px, transparent 1.2px)`,
    backgroundSize: "16px 16px",
  },
  number: { position: "absolute", top: 10, left: space.s3, color: colors.inkMuted },
  kind: { position: "absolute", top: space.s2, right: space.s3 },
  text: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    paddingTop: space.s4,
    paddingInline: 18,
    paddingBottom: 18,
    borderTopWidth: 1,
    borderTopStyle: "solid",
    borderTopColor: colors.line,
  },
  title: {
    fontWeight: 500,
    textDecorationLine: { default: "none", [stylex.when.ancestor(":hover")]: "underline" },
    textUnderlineOffset: 3,
  },
  lesson: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: space.s3,
    color: colors.inkSoft,
  },
  lessonNumber: { color: colors.inkMuted, marginInlineEnd: space.s2 },
});

type DiagramCardProps = {
  diagram: Diagram;
  lesson: Pick<Lesson, "number" | "slug" | "title">;
};

export function DiagramCard({ diagram, lesson }: DiagramCardProps) {
  return (
    <NextLink href={lessonHref(lesson)} {...stylex.props(styles.card, stylex.defaultMarker())}>
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
    </NextLink>
  );
}
