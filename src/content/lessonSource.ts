import { readFileSync } from "node:fs";
import { join } from "node:path";
import { headingId } from "./headingId";
import { lessonSources } from "./lessons/registry";

const LESSONS_DIR = join(process.cwd(), "src", "content", "lessons");

function sourcePath(slug: string) {
  return join(LESSONS_DIR, slug, "index.mdx");
}

export function hasLessonSource(slug: string) {
  return slug in lessonSources;
}

export async function loadLesson(slug: string) {
  const load = lessonSources[slug];
  return load ? (await load()).default : null;
}

export function lessonHeadings(slug: string) {
  const headings: { id: string; label: string }[] = [];
  let inFence = false;
  for (const line of readFileSync(sourcePath(slug), "utf8").split("\n")) {
    if (line.startsWith("```")) inFence = !inFence;
    if (inFence || !line.startsWith("## ")) continue;
    const label = line.slice(3).replace(/`/g, "").trim();
    headings.push({ id: headingId(label), label });
  }
  return headings;
}
