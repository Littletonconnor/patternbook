import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { lessonBySlug, lessons, neighbours, topicOf } from "@/content/catalog";
import { LessonEnd } from "@/components/LessonEnd";
import { LessonHeader } from "@/components/LessonHeader";
import { LessonLayout } from "@/components/LessonLayout";
import { Pager } from "@/components/Pager";
import { H2, P, Prose } from "@/components/Prose";
import { hasLessonSource, lessonHeadings, loadLesson } from "@/content/lessonSource";

export function generateStaticParams() {
  return lessons.map((lesson) => ({ slug: lesson.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/lessons/[slug]">): Promise<Metadata> {
  const lesson = lessonBySlug((await params).slug);
  return lesson
    ? {
        title: lesson.title,
        description: lesson.hook,
        openGraph: {
          type: "article",
          siteName: "Patternbook",
          title: lesson.title,
          description: lesson.hook,
        },
      }
    : {};
}

export default async function LessonPage({ params }: PageProps<"/lessons/[slug]">) {
  const { slug } = await params;
  const written = hasLessonSource(slug);
  const rail = written ? lessonHeadings(slug) : [{ id: "coming-soon", label: "Coming soon" }];

  return (
    <LessonLayout rail={rail}>
      <Suspense>
        <LessonBody slug={slug} />
      </Suspense>
    </LessonLayout>
  );
}

async function LessonBody({ slug }: { slug: string }) {
  const lesson = lessonBySlug(slug);
  const topic = lesson && topicOf(lesson);
  if (!lesson || !topic) notFound();
  const { previous, next } = neighbours(lesson);
  const Body = await loadLesson(slug);

  return (
    <>
      <LessonHeader topic={topic.title} lesson={lesson} />
      <Prose>
        {Body ? (
          <Body />
        ) : (
          <>
            <H2 id="coming-soon">Coming soon</H2>
            <P>
              This lesson is planned but not written yet. Use the sidebar or the links below to keep
              reading.
            </P>
          </>
        )}
      </Prose>
      {lesson.status === "published" && <LessonEnd slug={slug} />}
      <Pager previous={previous} next={next} />
    </>
  );
}
