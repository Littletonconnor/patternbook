import type { Metadata } from "next";
import * as stylex from "@stylexjs/stylex";
import { lessonBySlug } from "@/content/catalog";
import { diagramLesson, diagrams } from "@/content/diagrams";
import { lessonHref } from "@/content/types";
import type { Lesson } from "@/content/types";
import { DiagramIndex } from "./_parts/DiagramIndex";
import { PageIntro } from "@/components/shell/PageIntro";
import { PageShell } from "@/components/shell/PageShell";
import { colors, radius, space } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";
import { RowLink } from "@/ui/RowLink";

export const metadata: Metadata = {
  title: "Diagrams",
  description:
    "Every interactive diagram on Patternbook, filterable by kind, each linked to its lesson.",
};

const craftSlugs = [
  "building-interactive-svg-explainers",
  "animating-svg-paths",
  "scroll-driven-diagrams",
];

const styles = stylex.create({
  behind: {
    gap: `${space.s6} ${space.s16}`,
    display: "flex",
    flexWrap: "wrap",
    borderTopColor: colors.line,
    borderTopStyle: "solid",
    borderTopWidth: 1,
    paddingTop: space.s12,
  },
  behindText: {
    gap: space.s2,
    display: "flex",
    flexBasis: "280px",
    flexDirection: "column",
    flexGrow: "1",
    flexShrink: "1",
  },
  eyebrow: { color: colors.inkMuted },
  heading: { margin: 0 },
  blurb: { margin: 0, color: colors.inkSoft },
  list: {
    margin: 0,
    padding: 0,
    borderColor: colors.line,
    borderRadius: radius.frame,
    borderStyle: "solid",
    borderWidth: 1,
    listStyle: "none",
    overflow: "hidden",
    backgroundColor: colors.surface,
    flexBasis: "420px",
    flexGrow: "2",
    flexShrink: "1",
  },
  item: {
    borderTopColor: colors.line,
    borderTopStyle: "solid",
    borderTopWidth: { default: 1, ":first-child": 0 },
  },
  number: { color: colors.inkMuted },
  title: { flexGrow: 1, fontWeight: 500 },
  minutes: { color: colors.inkMuted, whiteSpace: "nowrap" },
});

export default function DiagramsPage() {
  const entries = diagrams.map((diagram) => {
    const { number, slug, title } = diagramLesson(diagram);
    return { diagram, lesson: { number, slug, title } };
  });
  const craft = craftSlugs
    .map((slug) => lessonBySlug(slug))
    .filter((lesson): lesson is Lesson => lesson !== undefined);

  return (
    <PageShell current="diagrams">
      <PageIntro eyebrow={`Diagrams · ${diagrams.length} planned`} title="All diagrams">
        Every interactive diagram on the site, filterable by kind. Each one shows a pattern working:
        change the inputs, step through it, and compare the broken and fixed versions. Each card
        links to the lesson that explains it.
      </PageIntro>

      <DiagramIndex entries={entries} />

      <section {...stylex.props(styles.behind)}>
        <div {...stylex.props(styles.behindText)}>
          <div {...stylex.props(type.label, styles.eyebrow)}>Implementation</div>
          <h2 {...stylex.props(type.heading, styles.heading)}>How the diagrams are built</h2>
          <p {...stylex.props(type.small, styles.blurb)}>
            The diagrams are SVG rendered by React components from one shared kit. These three
            lessons cover the techniques.
          </p>
        </div>
        <ul {...stylex.props(styles.list)}>
          {craft.map((lesson) => (
            <li key={lesson.slug} {...stylex.props(styles.item)}>
              <RowLink href={lessonHref(lesson)}>
                <span {...stylex.props(type.number, styles.number)}>{lesson.number}</span>
                <span {...stylex.props(type.body, styles.title)}>{lesson.title}</span>
                <span {...stylex.props(type.number, styles.minutes)}>{lesson.minutes} min</span>
              </RowLink>
            </li>
          ))}
        </ul>
      </section>
    </PageShell>
  );
}
