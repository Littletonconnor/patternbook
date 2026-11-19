import { ImageResponse } from "next/og";
import { lessonBySlug, lessons, topicOf } from "@/content/catalog";
import { OgCard, ogSize } from "../../ogImage";

export const alt = "A Patternbook lesson";
export const size = ogSize;
export const contentType = "image/png";

const levelNames = { foundations: "Foundations", core: "Core", advanced: "Advanced" };

export function generateStaticParams() {
  return lessons.map((lesson) => ({ slug: lesson.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const lesson = lessonBySlug((await params).slug);
  const topic = lesson && topicOf(lesson);
  if (!lesson || !topic) {
    return new ImageResponse(
      <OgCard eyebrow="Patternbook" title="Lesson not found" lede="" />,
      size,
    );
  }
  return new ImageResponse(
    <OgCard
      eyebrow={`Lesson ${lesson.number} · ${topic.title}`}
      title={lesson.title}
      lede={lesson.hook}
      footer={
        <>
          <span>{levelNames[lesson.level]}</span>
          <span>{lesson.minutes} min</span>
        </>
      }
    />,
    size,
  );
}
