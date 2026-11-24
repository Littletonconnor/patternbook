import { readFileSync } from "node:fs";
import { join } from "node:path";

import type { LessonSlug } from "@/content/catalog";
import { lessonSources } from "@/content/lessons/registry";
import { headingId } from "@/lib/headingId";

const LESSONS_DIR = join(process.cwd(), "src", "content", "lessons");

function sourcePath(slug: LessonSlug) {
  return join(LESSONS_DIR, slug, "index.mdx");
}

export function hasLessonSource(slug: LessonSlug) {
  return slug in lessonSources;
}

export async function loadLesson(slug: LessonSlug) {
  const load = lessonSources[slug];
  return load ? (await load()).default : null;
}

export function lessonHeadings(slug: LessonSlug) {
  const headings: { id: string; label: string }[] = [];
  let inFence = false;
  for (const line of readFileSync(sourcePath(slug), "utf8").split("\n")) {
    if (line.startsWith("```")) {
      inFence = !inFence;
    }
    if (inFence || !line.startsWith("## ")) {
      continue;
    }
    const label = line.slice(3).replaceAll("`", "").trim();
    headings.push({ id: headingId(label), label });
  }
  return headings;
}
