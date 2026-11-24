import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { LessonEnd } from "@/components/lesson/LessonEnd";
import { LessonHeader } from "@/components/lesson/LessonHeader";
import { Pager } from "@/components/lesson/Pager";
import { H2, P, Prose } from "@/components/lesson/Prose";
import { isLessonSlug, lessonBySlug, lessons, neighbours, topicOf } from "@/content/catalog";
import type { LessonSlug } from "@/content/catalog";
import { hasLessonSource, lessonHeadings, loadLesson } from "@/content/lessonSource";

import { LessonLayout } from "./_parts/LessonLayout";

export function generateStaticParams() {
  return lessons.map((lesson) => ({ slug: lesson.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/lessons/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  if (!isLessonSlug(slug)) {
    return {};
  }
  const lesson = lessonBySlug(slug);
  return {
    title: lesson.title,
    description: lesson.hook,
    openGraph: {
      type: "article",
      siteName: "Patternbook",
      title: lesson.title,
      description: lesson.hook,
    },
  };
}

export default async function LessonPage({ params }: PageProps<"/lessons/[slug]">) {
  const { slug } = await params;
  if (!isLessonSlug(slug)) {
    notFound();
  }
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

async function LessonBody({ slug }: { slug: LessonSlug }) {
  const lesson = lessonBySlug(slug);
  const topic = topicOf(lesson);
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
