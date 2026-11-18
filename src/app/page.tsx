import * as stylex from "@stylexjs/stylex";
import { ArrowRight } from "lucide-react";
import { formatMinutes, lessons, starterLessons, topics, totals } from "@/content/catalog";
import { lessonHref } from "@/content/types";
import { Footer } from "@/components/Footer";
import { HeroFigure } from "@/components/home/HeroFigure";
import { LevelCards } from "@/components/home/LevelCards";
import { SectionHead } from "@/components/home/SectionHead";
import { Thumbnail } from "@/components/home/Thumbnail";
import { TopicList } from "@/components/home/TopicList";
import { LessonCard } from "@/components/LessonCard";
import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { colors, measure, space } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";
import { ButtonLink } from "@/ui/ButtonLink";
import { Icon } from "@/ui/Icon";

const WIDE = "@media (min-width: 768px)";

const styles = stylex.create({
  page: { display: "flex", flexDirection: "column", minHeight: "100dvh" },
  topBar: { position: "sticky", top: 0, zIndex: 10 },
  main: {
    flexGrow: 1,
    boxSizing: "border-box",
    width: "100%",
    maxWidth: measure.page,
    marginInline: "auto",
    display: "flex",
    flexDirection: "column",
    gap: { default: space.s16, [WIDE]: 88 },
    paddingInline: { default: space.s4, [WIDE]: space.s6 },
    paddingBottom: space.s8,
  },
  hero: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: `${space.s12} ${space.s16}`,
    paddingTop: { default: space.s12, [WIDE]: space.s24 },
  },
  intro: {
    flex: "1 1 420px",
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: space.s6,
  },
  eyebrow: { color: colors.inkMuted },
  headline: { margin: 0, textWrap: "balance" },
  lede: { margin: 0, maxWidth: 520, color: colors.inkSoft, textWrap: "pretty" },
  actions: { display: "flex", flexWrap: "wrap", alignItems: "center", gap: space.s3 },
  facts: {
    display: "flex",
    flexWrap: "wrap",
    gap: `${space.s2} 20px`,
    color: colors.inkMuted,
  },
  section: { display: "flex", flexDirection: "column", gap: space.s6, scrollMarginTop: 80 },
  starters: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(200px, 100%), 1fr))",
    gap: space.s4,
  },
  levelsHead: { maxWidth: 680, display: "flex", flexDirection: "column", gap: space.s2 },
  levelsNote: { margin: 0, color: colors.inkSoft },
});

export default function Home() {
  const all = totals();
  const starters = totals(starterLessons);
  const hours = Math.round(all.minutes / 60);

  return (
    <div {...stylex.props(styles.page)}>
      <div {...stylex.props(styles.topBar)}>
        <TopBar drawer={<Sidebar topics={topics} />} />
      </div>
      <main {...stylex.props(styles.main)}>
        <section {...stylex.props(styles.hero)}>
          <div {...stylex.props(styles.intro)}>
            <div {...stylex.props(type.label, styles.eyebrow)}>
              An interactive engineering notebook
            </div>
            <h1 {...stylex.props(type.hero, styles.headline)}>
              Learn the pattern by breaking it first.
            </h1>
            <p {...stylex.props(type.lede, styles.lede)}>
              Short lessons on the problems every engineer runs into, each built around a figure you
              operate yourself. Cause the bug, switch on the fix, and see why it works.
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
              <span>no account</span>
            </div>
          </div>
          <HeroFigure />
        </section>

        <section {...stylex.props(styles.section)}>
          <SectionHead
            title="Good places to start"
            meta={`${starters.lessons} lessons · ${formatMinutes(starters.minutes)}`}
          />
          <div {...stylex.props(styles.starters)}>
            {starterLessons.map((lesson) => (
              <LessonCard
                key={lesson.slug}
                lesson={lesson}
                thumbnail={<Thumbnail slug={lesson.slug} />}
              />
            ))}
          </div>
        </section>

        <section {...stylex.props(styles.section)}>
          <div {...stylex.props(styles.levelsHead)}>
            <SectionHead title="Or go from zero, one level at a time" />
            <p {...stylex.props(type.small, styles.levelsNote)}>
              Every lesson has a level. Read all of one level across every topic before moving to
              the next.
            </p>
          </div>
          <LevelCards />
        </section>

        <section id="topics" {...stylex.props(styles.section)}>
          <SectionHead
            title="Everything, by topic"
            meta={`${topics.length} topics · ${all.lessons} lessons`}
          />
          <TopicList />
        </section>

        <Footer />
      </main>
    </div>
  );
}
