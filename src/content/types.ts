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
  starter?: boolean;
};

export type Topic = {
  slug: string;
  title: string;
  description: string;
  lessons: Lesson[];
};

export function lessonHref(lesson: Pick<Lesson, "slug">) {
  return `/lessons/${lesson.slug}`;
}

export type FigureKind = "playground" | "race" | "timeline" | "flow" | "structure" | "meter";

export type Figure = {
  number: string;
  kind: FigureKind;
  title: string;
  lesson: string;
};
