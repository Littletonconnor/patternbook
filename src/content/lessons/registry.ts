import type { MDXContent } from "mdx/types";

type LessonModule = { default: MDXContent };

export const lessonSources: Partial<Record<string, () => Promise<LessonModule>>> = {};
