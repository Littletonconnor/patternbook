export type Level = "foundations" | "core" | "advanced";

export type LessonStatus = "published" | "planned";

export type Lesson = {
  number: number;
  slug: string;
  title: string;
  hook: string;
  level: Level;
  minutes: number;
  status: LessonStatus;
};

export type Topic = {
  slug: string;
  title: string;
  lessons: Lesson[];
};

export function lessonHref(lesson: Pick<Lesson, "slug">) {
  return `/lessons/${lesson.slug}`;
}
