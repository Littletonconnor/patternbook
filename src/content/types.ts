import type { LessonSlug, TopicSlug } from "./catalog";

export type Level = "foundations" | "core" | "advanced";

export type LessonStatus = "published" | "planned";

type LessonFields = {
  number: number;
  title: string;
  hook: string;
  level: Level;
  minutes: number;
  status: LessonStatus;
  starter?: boolean;
};

type TopicFields = {
  title: string;
  description: string;
};

export type LessonEntry = LessonFields & { slug: string };

export type TopicEntry = TopicFields & {
  slug: string;
  lessons: readonly [LessonEntry, ...LessonEntry[]];
};

export type Lesson = LessonFields & { slug: LessonSlug };

export type Topic = TopicFields & {
  slug: TopicSlug;
  lessons: readonly [Lesson, ...Lesson[]];
};

export function lessonHref(lesson: Pick<Lesson, "slug">) {
  return `/lessons/${lesson.slug}` as const;
}

export type DiagramKind = "playground" | "race" | "timeline" | "flow" | "structure" | "meter";

export type Diagram = {
  number: string;
  kind: DiagramKind;
  title: string;
  lesson: LessonSlug;
};
