import type { Metadata } from "next";
import NextLink from "next/link";
import * as stylex from "@stylexjs/stylex";
import { lessonBySlug } from "@/content/catalog";
import { diagramLesson, diagrams } from "@/content/diagrams";
import { lessonHref, type Lesson } from "@/content/types";
import { DiagramIndex } from "@/components/DiagramIndex";
import { PageIntro } from "@/components/PageIntro";
import { PageShell } from "@/components/PageShell";
import { colors, radius, space } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";

export const metadata: Metadata = {
  title: "Diagrams",
  description:
    "Every interactive diagram on Patternbook, filterable by kind, each linked to its lesson.",
};

const HOVER = "@media (hover: hover)";

const craftSlugs = [
  "building-interactive-svg-explainers",
  "animating-svg-paths",
  "scroll-driven-diagrams",
];

const styles = stylex.create({
  behind: {
    display: "flex",
    flexWrap: "wrap",
    gap: `${space.s6} ${space.s16}`,
    paddingTop: space.s12,
    borderTopWidth: 1,
    borderTopStyle: "solid",
    borderTopColor: colors.line,
  },
  behindText: { flex: "1 1 280px", display: "flex", flexDirection: "column", gap: space.s2 },
  eyebrow: { color: colors.inkMuted },
  heading: { margin: 0 },
  blurb: { margin: 0, color: colors.inkSoft },
  list: {
    flex: "2 1 420px",
    margin: 0,
    padding: 0,
    listStyle: "none",
    overflow: "hidden",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors.line,
    borderRadius: radius.frame,
  },
  item: {
    borderTopWidth: { default: 1, ":first-child": 0 },
    borderTopStyle: "solid",
    borderTopColor: colors.line,
  },
  row: {
    display: "flex",
    alignItems: "baseline",
    gap: space.s4,
    paddingBlock: 14,
    paddingInline: 18,
    color: colors.ink,
    textDecorationLine: "none",
    backgroundColor: {
      default: "transparent",
      ":hover": { default: null, [HOVER]: colors.sunken },
    },
    outlineStyle: { default: "none", ":focus-visible": "solid" },
    outlineWidth: 2,
    outlineOffset: -2,
    outlineColor: colors.focus,
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
              <NextLink href={lessonHref(lesson)} {...stylex.props(styles.row)}>
                <span {...stylex.props(type.number, styles.number)}>{lesson.number}</span>
                <span {...stylex.props(type.body, styles.title)}>{lesson.title}</span>
                <span {...stylex.props(type.number, styles.minutes)}>{lesson.minutes} min</span>
              </NextLink>
            </li>
          ))}
        </ul>
      </section>
    </PageShell>
  );
}
