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
  description: "What Patternbook covers, how each lesson is structured, and who writes it.",
};

const steps = [
  {
    title: "Problem",
    body: "The situation and its symptoms, described before any solution is named.",
    tone: "muted",
  },
  {
    title: "Failure",
    body: "The naive approach running in the diagram until it breaks.",
    tone: "fault",
  },
  {
    title: "Fix",
    body: "The pattern applied in the same diagram, with a toggle to switch between the broken and fixed versions.",
    tone: "sound",
  },
  {
    title: "Trade-offs",
    body: "What the pattern adds in complexity or performance, when not to use it, and further reading.",
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
    body: "HTTP and the browser, the shell and Linux processes, how Git stores history, and how containers are built from namespaces and cgroups.",
  },
  {
    title: "Diagrams",
    body: "How the diagrams on this site are built: interactive SVG, path animation and scroll-driven diagrams.",
  },
];

const rules = [
  {
    title: "Failure before fix",
    body: "Each lesson shows the problem happening before it introduces the solution.",
  },
  {
    title: "One idea per diagram",
    body: "A diagram that needs more than a short caption is split into two.",
  },
  {
    title: "Terms are defined",
    body: "Every technical term has a short definition, shown on hover.",
  },
  {
    title: "No account",
    body: "Read progress is stored in localStorage in your browser.",
  },
];

const styles = stylex.create({
  section: { gap: space.s6, display: "flex", flexDirection: "column" },
  prose: { gap: space.s4, display: "flex", flexDirection: "column", maxWidth: measure.prose },
  heading: { margin: 0 },
  paragraph: { margin: 0, textWrap: "pretty" },
  soft: { color: colors.inkSoft },
  head: {
    gap: `${space.s1} ${space.s4}`,
    alignItems: "baseline",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  muted: { color: colors.inkMuted },
  steps: {
    margin: 0,
    padding: 0,
    gap: space.s4,
    listStyle: "none",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(220px, 100%), 1fr))",
  },
  card: {
    padding: 20,
    borderColor: colors.line,
    borderRadius: radius.frame,
    borderStyle: "solid",
    borderWidth: 1,
    gap: 10,
    backgroundColor: colors.surface,
    display: "flex",
    flexDirection: "column",
  },
  title: { fontWeight: 600 },
  areas: {
    gap: space.s8,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 1fr))",
  },
  area: {
    gap: space.s2,
    display: "flex",
    flexDirection: "column",
    borderTopColor: colors.ink,
    borderTopStyle: "solid",
    borderTopWidth: 1.5,
    paddingTop: space.s4,
  },
  rules: {
    margin: 0,
    padding: 0,
    borderColor: colors.line,
    borderRadius: radius.frame,
    borderStyle: "solid",
    borderWidth: 1,
    listStyle: "none",
    overflow: "hidden",
    backgroundColor: colors.surface,
  },
  rule: {
    gap: `${space.s1} ${space.s6}`,
    paddingBlock: space.s4,
    paddingInline: 20,
    display: "flex",
    flexWrap: "wrap",
    borderTopColor: colors.line,
    borderTopStyle: "solid",
    borderTopWidth: { default: 1, ":first-child": 0 },
  },
  ruleTitle: { flexBasis: "240px", flexGrow: "0", flexShrink: "0", fontWeight: 500 },
  ruleBody: { color: colors.inkSoft, flexBasis: "320px", flexGrow: "999", flexShrink: "1" },
  author: { gap: 10, display: "flex", flexDirection: "column", maxWidth: 580 },
  links: { gap: `${space.s2} 20px`, display: "flex", flexWrap: "wrap" },
});

const stepTones = stylex.create({
  muted: { color: colors.inkMuted },
  fault: { color: colors.faultInk },
  sound: { color: colors.soundInk },
});

export default function AboutPage() {
  return (
    <PageShell current="about" width="narrow">
      <PageIntro eyebrow="About" title="About Patternbook">
        Patternbook is a set of short lessons on problems that come up in everyday software work,
        such as paginating a list that changes between requests, handling bursts of input events,
        and isolating processes in containers. Each lesson covers one problem and its standard
        solution.
      </PageIntro>

      <section {...stylex.props(styles.prose)}>
        <h2 {...stylex.props(type.heading, styles.heading)}>Why every lesson has a diagram</h2>
        <p {...stylex.props(type.body, styles.paragraph)}>
          Many of these bugs are easy to describe and easy to miss. Offset pagination can return the
          same row on two pages, but only when rows are inserted between requests, so it rarely
          shows up in testing.
        </p>
        <p {...stylex.props(type.body, styles.paragraph)}>
          Each diagram shows the broken and fixed versions of the pattern. You can change the
          inputs, step through each version and watch what happens, so you can reproduce the failure
          yourself, switch on the fix and see why it works. The diagram makes the timing and
          ordering visible, which is usually where these bugs hide.
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
        <h2 {...stylex.props(type.heading, styles.heading)}>Conventions</h2>
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
        <h2 {...stylex.props(type.heading, styles.heading)}>Author</h2>
        <div {...stylex.props(styles.author)}>
          <span {...stylex.props(type.body, styles.title)}>Connor Littleton</span>
          <p {...stylex.props(type.body, styles.paragraph, styles.soft)}>
            I&rsquo;m a full stack engineer at Wealthfront. Patternbook started as my notes on
            problems I ran into at work.
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
