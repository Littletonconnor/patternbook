import type { MDXContent } from "mdx/types";

import type { LessonSlug } from "@/content/catalog";

type LessonModule = { default: MDXContent };

export const lessonSources: Partial<Record<LessonSlug, () => Promise<LessonModule>>> = {};
