import { readdirSync } from "node:fs";
import { join } from "node:path";

import { expect, test } from "vitest";

import { lessons } from "@/content/catalog";

import { lessonSources } from "./registry";

const lessonsDir = join(process.cwd(), "src", "content", "lessons");
const lessonFolders = readdirSync(lessonsDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);
const registered = Object.keys(lessonSources);

test("every lesson folder has an entry in the registry", () => {
  for (const folder of lessonFolders) {
    expect(registered, `src/content/lessons/${folder} is not in registry.ts`).toContain(folder);
  }
});

test("every registry entry has a lesson folder with an index.mdx", () => {
  for (const slug of registered) {
    expect(readdirSync(join(lessonsDir, slug)), `lesson "${slug}"`).toContain("index.mdx");
  }
});

test("every published lesson has a source in the registry", () => {
  for (const lesson of lessons.filter(({ status }) => status === "published")) {
    expect(registered, `lesson "${lesson.slug}" is published but has no source`).toContain(
      lesson.slug,
    );
  }
});
