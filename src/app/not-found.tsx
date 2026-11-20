import type { Metadata } from "next";
import * as stylex from "@stylexjs/stylex";
import { ArrowRight } from "lucide-react";
import { starterLessons } from "@/content/catalog";
import { LessonCard } from "@/components/LessonCard";
import { PageIntro } from "@/components/PageIntro";
import { PageShell } from "@/components/PageShell";
import { SectionHead } from "@/components/home/SectionHead";
import { Thumbnail } from "@/components/home/Thumbnail";
import { space } from "@/tokens/tokens.stylex";
import { ButtonLink } from "@/ui/ButtonLink";
import { Icon } from "@/ui/Icon";

export const metadata: Metadata = {
  title: "Page not found",
};

const styles = stylex.create({
  intro: { display: "flex", flexDirection: "column", gap: space.s6 },
  actions: { display: "flex", flexWrap: "wrap", gap: space.s3 },
  section: { display: "flex", flexDirection: "column", gap: space.s6 },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(200px, 100%), 1fr))",
    gap: space.s4,
  },
});

export default function NotFound() {
  return (
    <PageShell>
      <div {...stylex.props(styles.intro)}>
        <PageIntro eyebrow="404" title="Page not found">
          Nothing exists at this URL. If you followed a link to a lesson, the lesson may have been
          renamed.
        </PageIntro>
        <div {...stylex.props(styles.actions)}>
          <ButtonLink variant="primary" size="large" href="/">
            Go to the homepage
            <Icon icon={ArrowRight} size={14} />
          </ButtonLink>
          <ButtonLink size="large" href="/#topics">
            All topics
          </ButtonLink>
        </div>
      </div>

      <section {...stylex.props(styles.section)}>
        <SectionHead title="Starter lessons" />
        <div {...stylex.props(styles.grid)}>
          {starterLessons.map((lesson) => (
            <LessonCard
              key={lesson.slug}
              lesson={lesson}
              thumbnail={<Thumbnail slug={lesson.slug} />}
            />
          ))}
        </div>
      </section>
    </PageShell>
  );
}
