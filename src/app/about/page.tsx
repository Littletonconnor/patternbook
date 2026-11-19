import type { Metadata } from "next";
import * as stylex from "@stylexjs/stylex";
import { lessons, topics } from "@/content/catalog";
import { PageIntro } from "@/components/PageIntro";
import { PageShell } from "@/components/PageShell";
import { colors, measure, radius, space } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";
import { Link } from "@/ui/Link";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why Patternbook exists, how a lesson works, and the house rules every figure follows.",
};

const steps = [
  {
    title: "The problem",
    body: "A situation you will recognise, in plain words, before any solution is named.",
    tone: "muted",
  },
  {
    title: "Break it",
    body: "The obvious approach, running, until it fails in front of you.",
    tone: "fault",
  },
  {
    title: "Fix it",
    body: "The pattern, in the same figure, so you can flip between the two.",
    tone: "sound",
  },
  {
    title: "Meet it in the wild",
    body: "Trade-offs, where you will run into it, and a short list of things worth reading next.",
    tone: "muted",
  },
] as const;

const areas = [
  {
    title: "Patterns",
    body: "Pagination, caching, optimistic updates, debouncing, indexes, transactions, auth, rate limiting, retries, real-time sync.",
  },
  {
    title: "Under the hood",
    body: "Everything between typing a URL and seeing a page, what the shell and Linux are doing, how Git stores history, and what a container actually is.",
  },
  {
    title: "The craft",
    body: "How the figures themselves are made: interactive SVG, animated paths and diagrams that follow your scroll.",
  },
];

const rules = [
  {
    title: "Show the failure first",
    body: "A fix means nothing until you have seen what it prevents.",
  },
  { title: "One idea per figure", body: "If a figure needs a manual, it becomes two figures." },
  {
    title: "No term without a definition",
    body: "Every piece of jargon is one hover away from plain words.",
  },
  {
    title: "Nothing in the way",
    body: "No account and no sign-up. Your progress is kept in your own browser.",
  },
];

const styles = stylex.create({
  section: { display: "flex", flexDirection: "column", gap: space.s6 },
  prose: { display: "flex", flexDirection: "column", gap: space.s4, maxWidth: measure.prose },
  heading: { margin: 0 },
  paragraph: { margin: 0, textWrap: "pretty" },
  soft: { color: colors.inkSoft },
  head: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: `${space.s1} ${space.s4}`,
  },
  muted: { color: colors.inkMuted },
  steps: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(220px, 100%), 1fr))",
    gap: space.s4,
    margin: 0,
    padding: 0,
    listStyle: "none",
  },
  card: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    padding: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors.line,
    borderRadius: radius.frame,
  },
  title: { fontWeight: 600 },
  areas: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 1fr))",
    gap: space.s8,
  },
  area: {
    display: "flex",
    flexDirection: "column",
    gap: space.s2,
    paddingTop: space.s4,
    borderTopWidth: 1.5,
    borderTopStyle: "solid",
    borderTopColor: colors.ink,
  },
  rules: {
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
  rule: {
    display: "flex",
    flexWrap: "wrap",
    gap: `${space.s1} ${space.s6}`,
    paddingBlock: space.s4,
    paddingInline: 20,
    borderTopWidth: { default: 1, ":first-child": 0 },
    borderTopStyle: "solid",
    borderTopColor: colors.line,
  },
  ruleTitle: { flex: "0 0 240px", fontWeight: 500 },
  ruleBody: { flex: "999 1 320px", color: colors.inkSoft },
  author: { display: "flex", flexDirection: "column", gap: 10, maxWidth: 580 },
  links: { display: "flex", flexWrap: "wrap", gap: `${space.s2} 20px` },
});

const stepTones = stylex.create({
  muted: { color: colors.inkMuted },
  fault: { color: colors.faultInk },
  sound: { color: colors.soundInk },
});

export default function AboutPage() {
  return (
    <PageShell current="about" width="narrow">
      <PageIntro
        eyebrow="About"
        size="hero"
        title="The problems every engineer meets, made to be poked at."
      >
        Patternbook is a notebook of everyday engineering problems and the patterns that solve them.
        Not interview puzzles. The things that turn up in ordinary work: paging a list, taming a
        burst of events, understanding what a container really is.
      </PageIntro>

      <section {...stylex.props(styles.prose)}>
        <h2 {...stylex.props(type.heading, styles.heading)}>Why it exists</h2>
        <p {...stylex.props(type.body, styles.paragraph)}>
          Most of these patterns are easy to read about and hard to believe. You nod along to
          &ldquo;offset pagination can return duplicates&rdquo; and then ship it anyway, because you
          have never watched it happen.
        </p>
        <p {...stylex.props(type.body, styles.paragraph)}>
          So every lesson here is built around a figure you operate yourself. You cause the bug with
          your own clicks, then switch on the fix and watch the same input come out right.
        </p>
      </section>

      <section {...stylex.props(styles.section)}>
        <h2 {...stylex.props(type.heading, styles.heading)}>How a lesson works</h2>
        <ol {...stylex.props(styles.steps)}>
          {steps.map((step, i) => (
            <li key={step.title} {...stylex.props(styles.card)}>
              <span {...stylex.props(type.number, stepTones[step.tone])}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span {...stylex.props(type.body, styles.title)}>{step.title}</span>
              <span {...stylex.props(type.small, styles.soft)}>{step.body}</span>
            </li>
          ))}
        </ol>
      </section>

      <section {...stylex.props(styles.section)}>
        <div {...stylex.props(styles.head)}>
          <h2 {...stylex.props(type.heading, styles.heading)}>What it covers</h2>
          <span {...stylex.props(type.number, styles.muted)}>
            {topics.length} topics · {lessons.length} lessons planned
          </span>
        </div>
        <div {...stylex.props(styles.areas)}>
          {areas.map((area) => (
            <div key={area.title} {...stylex.props(styles.area)}>
              <span {...stylex.props(type.body, styles.title)}>{area.title}</span>
              <span {...stylex.props(type.small, styles.soft)}>{area.body}</span>
            </div>
          ))}
        </div>
      </section>

      <section {...stylex.props(styles.section)}>
        <h2 {...stylex.props(type.heading, styles.heading)}>House rules</h2>
        <ol {...stylex.props(styles.rules)}>
          {rules.map((rule) => (
            <li key={rule.title} {...stylex.props(styles.rule)}>
              <span {...stylex.props(type.body, styles.ruleTitle)}>{rule.title}</span>
              <span {...stylex.props(type.small, styles.ruleBody)}>{rule.body}</span>
            </li>
          ))}
        </ol>
      </section>

      <section {...stylex.props(styles.section)}>
        <h2 {...stylex.props(type.heading, styles.heading)}>Who makes it</h2>
        <div {...stylex.props(styles.author)}>
          <span {...stylex.props(type.body, styles.title)}>Connor Littleton</span>
          <p {...stylex.props(type.body, styles.paragraph, styles.soft)}>
            I&rsquo;m a software engineer. Patternbook started as my own notes on the problems I
            kept running into at work, rebuilt as figures I could actually poke at.
          </p>
          <div {...stylex.props(type.ui, styles.links)}>
            <Link variant="external" href="https://github.com/Littletonconnor">
              GitHub
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
