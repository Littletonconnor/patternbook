import * as stylex from "@stylexjs/stylex";

import { LessonCard } from "@/components/catalog/LessonCard";
import { SectionHead } from "@/components/catalog/SectionHead";
import { Thumbnail } from "@/components/catalog/Thumbnail";
import { Footer } from "@/components/shell/Footer";
import { Sidebar } from "@/components/shell/Sidebar";
import { TopBar } from "@/components/shell/TopBar";
import { formatMinutes, starterLessons, topics, totals } from "@/content/catalog";
import { measure, space } from "@/tokens/tokens.stylex";

import { HomeHero } from "./_parts/HomeHero";
import { LevelCards } from "./_parts/LevelCards";
import { TopicList } from "./_parts/TopicList";

const WIDE = "@media (min-width: 768px)";

const styles = stylex.create({
  page: { display: "flex", flexDirection: "column", minHeight: "100dvh" },
  topBar: { position: "sticky", zIndex: 10, top: 0 },
  main: {
    gap: { [WIDE]: 88, default: space.s16 },
    marginInline: "auto",
    paddingInline: { [WIDE]: space.s6, default: space.s4 },
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    maxWidth: measure.page,
    paddingBottom: space.s8,
    width: "100%",
  },
  section: { gap: space.s6, display: "flex", flexDirection: "column", scrollMarginTop: 80 },
  starters: {
    gap: space.s4,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(200px, 100%), 1fr))",
  },
});

export default function Home() {
  const all = totals();
  const starters = totals(starterLessons);

  return (
    <div {...stylex.props(styles.page)}>
      <div {...stylex.props(styles.topBar)}>
        <TopBar drawer={<Sidebar topics={topics} />} />
      </div>
      <main {...stylex.props(styles.main)}>
        <HomeHero />

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
