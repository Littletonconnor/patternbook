import * as stylex from "@stylexjs/stylex";
import { ArrowRight } from "lucide-react";

import { lessons, topics, totals } from "@/content/catalog";
import { lessonHref } from "@/content/types";
import { colors, space } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";
import { ButtonLink } from "@/ui/ButtonLink";
import { Icon } from "@/ui/Icon";

import { HeroDiagram } from "./HeroDiagram";

const WIDE = "@media (min-width: 768px)";

const styles = stylex.create({
  hero: {
    gap: `${space.s12} ${space.s16}`,
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
    paddingTop: { [WIDE]: space.s24, default: space.s12 },
  },
  intro: {
    gap: space.s6,
    display: "flex",
    flexBasis: "420px",
    flexDirection: "column",
    flexGrow: "1",
    flexShrink: "1",
    minWidth: 0,
  },
  eyebrow: { color: colors.inkMuted },
  headline: { margin: 0, textWrap: "balance" },
  lede: { margin: 0, color: colors.inkSoft, textWrap: "pretty", maxWidth: 520 },
  actions: { gap: space.s3, alignItems: "center", display: "flex", flexWrap: "wrap" },
  facts: {
    gap: `${space.s2} 20px`,
    color: colors.inkMuted,
    display: "flex",
    flexWrap: "wrap",
  },
});

export function HomeHero() {
  const all = totals();
  const hours = Math.round(all.minutes / 60);
  return (
    <section {...stylex.props(styles.hero)}>
      <div {...stylex.props(styles.intro)}>
        <div {...stylex.props(type.label, styles.eyebrow)}>Lessons with interactive diagrams</div>
        <h1 {...stylex.props(type.hero, styles.headline)}>
          Interactive lessons on software engineering patterns
        </h1>
        <p {...stylex.props(type.lede, styles.lede)}>
          Each lesson explains one problem, such as duplicate rows in offset pagination or race
          conditions in optimistic updates, and the pattern that solves it. Each lesson also has an
          interactive diagram of the broken and fixed versions. You can change the inputs, step
          through both and watch the pattern work. The diagram makes the timing and ordering
          visible, which is usually where these bugs hide.
        </p>
        <div {...stylex.props(styles.actions)}>
          <ButtonLink variant="primary" size="large" href={lessonHref(lessons[0])}>
            Start with lesson 1
            <Icon icon={ArrowRight} size={14} />
          </ButtonLink>
          <ButtonLink size="large" href="#topics">
            Browse all topics
          </ButtonLink>
        </div>
        <div {...stylex.props(type.number, styles.facts)}>
          <span>{topics.length} topics</span>
          <span>{all.lessons} lessons</span>
          <span>about {hours} hours</span>
        </div>
      </div>
      <HeroDiagram />
    </section>
  );
}
