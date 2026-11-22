import type { Metadata } from "next";
import * as stylex from "@stylexjs/stylex";
import { AboutAreas } from "./_parts/AboutAreas";
import { AboutRules } from "./_parts/AboutRules";
import { AboutSteps } from "./_parts/AboutSteps";
import { lessons, topics } from "@/content/catalog";
import { PageIntro } from "@/components/shell/PageIntro";
import { PageShell } from "@/components/shell/PageShell";
import { colors, measure, space } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";
import { Link } from "@/ui/Link";

export const metadata: Metadata = {
  title: "About",
  description: "What Patternbook covers, how each lesson is structured, and who writes it.",
};

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
  title: { fontWeight: 600 },
  author: { gap: 10, display: "flex", flexDirection: "column", maxWidth: 580 },
  links: { gap: `${space.s2} 20px`, display: "flex", flexWrap: "wrap" },
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
        <AboutSteps />
      </section>

      <section {...stylex.props(styles.section)}>
        <div {...stylex.props(styles.head)}>
          <h2 {...stylex.props(type.heading, styles.heading)}>What it covers</h2>
          <span {...stylex.props(type.number, styles.muted)}>
            {topics.length} topics · {lessons.length} lessons planned
          </span>
        </div>
        <AboutAreas />
      </section>

      <section {...stylex.props(styles.section)}>
        <h2 {...stylex.props(type.heading, styles.heading)}>Conventions</h2>
        <AboutRules />
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
