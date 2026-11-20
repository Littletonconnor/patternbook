import * as stylex from "@stylexjs/stylex";
import type { Lesson } from "@/content/types";
import { colors, measure, space } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";
import { Badge } from "@/ui/Badge";

const styles = stylex.create({
  header: {
    display: "flex",
    flexDirection: "column",
    gap: space.s4,
    maxWidth: measure.prose,
  },
  eyebrow: { color: colors.inkMuted },
  title: { margin: 0, textWrap: "balance" },
  lede: { margin: 0, color: colors.inkSoft },
  meta: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: `${space.s2} ${space.s4}`,
    color: colors.inkMuted,
  },
});

type LessonHeaderProps = {
  topic: string;
  lesson: Pick<Lesson, "number" | "title" | "hook" | "level" | "minutes">;
  diagrams?: number;
  languages?: readonly string[];
};

export function LessonHeader({ topic, lesson, diagrams = 0, languages = [] }: LessonHeaderProps) {
  return (
    <header {...stylex.props(styles.header)}>
      <div {...stylex.props(type.label, styles.eyebrow)}>
        {topic} · Lesson {lesson.number}
      </div>
      <h1 {...stylex.props(type.display, styles.title)}>{lesson.title}</h1>
      <p {...stylex.props(type.lede, styles.lede)}>{lesson.hook}</p>
      <div {...stylex.props(type.number, styles.meta)}>
        <Badge level={lesson.level} />
        <span>{lesson.minutes} min</span>
        {diagrams > 0 && (
          <span>
            {diagrams} {diagrams === 1 ? "diagram" : "diagrams"}
          </span>
        )}
        {languages.length > 0 && <span>{languages.join(" · ")}</span>}
      </div>
    </header>
  );
}
