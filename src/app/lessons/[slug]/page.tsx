import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { lessonBySlug, lessons, neighbours, topicOf } from "@/content/catalog";
import { LessonEnd } from "@/components/LessonEnd";
import { LessonHeader } from "@/components/LessonHeader";
import { LessonLayout } from "@/components/LessonLayout";
import { Pager } from "@/components/Pager";
import { H2, P, Prose } from "@/components/Prose";

export function generateStaticParams() {
  return lessons.map((lesson) => ({ slug: lesson.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/lessons/[slug]">): Promise<Metadata> {
  const lesson = lessonBySlug((await params).slug);
  return lesson ? { title: `${lesson.title} · Patternbook`, description: lesson.hook } : {};
}

export default function LessonPage({ params }: PageProps<"/lessons/[slug]">) {
  return (
    <LessonLayout rail={[{ id: "coming-soon", label: "Coming soon" }]}>
      <Suspense>
        <LessonBody params={params} />
      </Suspense>
    </LessonLayout>
  );
}

async function LessonBody({ params }: Pick<PageProps<"/lessons/[slug]">, "params">) {
  const { slug } = await params;
  const lesson = lessonBySlug(slug);
  const topic = lesson && topicOf(lesson);
  if (!lesson || !topic) notFound();
  const { previous, next } = neighbours(lesson);

  return (
    <>
      <LessonHeader topic={topic.title} lesson={lesson} />
      <Prose>
        <H2 id="coming-soon">Coming soon</H2>
        <P>
          This lesson is planned but not written yet. Use the sidebar or the links below to keep
          reading.
        </P>
      </Prose>
      {lesson.status === "published" && <LessonEnd slug={slug} />}
      <Pager previous={previous} next={next} />
    </>
  );
}
