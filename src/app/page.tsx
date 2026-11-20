import * as stylex from "@stylexjs/stylex";
import { ArrowRight } from "lucide-react";
import { formatMinutes, lessons, starterLessons, topics, totals } from "@/content/catalog";
import { lessonHref } from "@/content/types";
import { Footer } from "@/components/Footer";
import { HeroDiagram } from "@/components/home/HeroDiagram";
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
              Lessons with interactive diagrams
            </div>
            <h1 {...stylex.props(type.hero, styles.headline)}>
              Interactive lessons on software engineering patterns
            </h1>
            <p {...stylex.props(type.lede, styles.lede)}>
              Each lesson explains one problem, such as duplicate rows in offset pagination or race
              conditions in optimistic updates, and the pattern that solves it. Each lesson also has
              an interactive diagram of the broken and fixed versions. You can change the inputs,
              step through both and watch the pattern work. The diagram makes the timing and
              ordering visible, which is usually where these bugs hide.
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

        <section {...stylex.props(styles.section)}>
          <SectionHead
            title="Starter lessons"
            meta={`${starters.lessons} lessons · ${formatMinutes(starters.minutes)}`}
            description="Self-contained lessons on problems most codebases run into early. Each diagram shows the bug happening, then lets you switch on the fix and run it again."
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
          <SectionHead
            title="By level"
            description="Every lesson has a level. Foundations covers the layers underneath: HTTP, browser rendering, the shell and Git. Core covers the patterns used in everyday application code. Advanced covers behavior under load, partial failure and scale. To work through everything in order, finish one level across all topics before starting the next."
          />
          <LevelCards />
        </section>

        <section id="topics" {...stylex.props(styles.section)}>
          <SectionHead
            title="All topics"
            meta={`${topics.length} topics · ${all.lessons} lessons`}
            description="Each topic is self-contained. Lessons within a topic go from the basic mechanism to its edge cases."
          />
          <TopicList />
        </section>

        <Footer />
      </main>
    </div>
  );
}
