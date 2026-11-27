import { expect, test } from "vitest";

import { structureProblems } from "./structure.mts";
import type { ImportsOf } from "./structure.mts";

function graph(edges: Record<string, string[]>): ImportsOf {
  return (file) => edges[file] ?? [];
}

const site = {
  "src/app/page.tsx": ["src/components/shell/PageShell.tsx", "src/app/_parts/HomeHero.tsx"],
  "src/app/about/page.tsx": ["src/components/shell/PageShell.tsx"],
};
const siteFiles = [
  "src/app/page.tsx",
  "src/app/_parts/HomeHero.tsx",
  "src/app/about/page.tsx",
  "src/components/shell/PageShell.tsx",
  "src/lib/headingId.ts",
];

test("accepts files in their layers and modules shared by two routes", () => {
  expect(structureProblems(siteFiles, graph(site))).toEqual([]);
});

test("accepts tests and fixtures beside routes, components and src/testing", () => {
  const files = [
    ...siteFiles,
    "src/app/api/signup/route.ts",
    "src/app/api/signup/route.test.ts",
    "src/components/shell/PageShell.test.tsx",
    "src/components/shell/menu.fixture.ts",
    "src/testing/startTestDatabase.ts",
  ];

  expect(structureProblems(files, graph(site))).toEqual([]);
});

test("rejects a folder in src that is not a layer", () => {
  expect(structureProblems(["src/utils/format.ts"], graph({}))).toEqual([
    "src/utils/format.ts: src/utils is not a layer. Put the file in one of: app, components, diagrams, ui, hooks, content, tokens, lib, testing (RFC 0002 part 2).",
  ]);
});

test("rejects a route-only module outside _parts", () => {
  const files = ["src/app/about/page.tsx", "src/app/about/AboutSteps.tsx"];

  expect(structureProblems(files, graph({}))).toEqual([
    "src/app/about/AboutSteps.tsx: only routes and Next.js special files sit in a route folder. Move route-only modules into ./_parts/ (RFC 0002 part 3).",
  ]);
});

test("rejects a shared component used by one route", () => {
  const files = ["src/app/page.tsx", "src/components/catalog/LessonCard.tsx"];
  const edges = { "src/app/page.tsx": ["src/components/catalog/LessonCard.tsx"] };

  expect(structureProblems(files, graph(edges))).toEqual([
    "src/components/catalog/LessonCard.tsx: only / uses this module. Move it to that route's _parts/ folder (RFC 0002 part 3).",
  ]);
});

test("rejects a shared component no route imports", () => {
  expect(structureProblems(["src/components/catalog/Orphan.tsx"], graph({}))).toEqual([
    "src/components/catalog/Orphan.tsx: no route imports this module. Delete it, or import it where it is needed.",
  ]);
});

test("counts only modules, not tests, toward an area's size", () => {
  const modules = Array.from({ length: 15 }, (_, i) => `src/components/shell/Part${i}.tsx`);
  const tests = modules.map((file) => file.replace(".tsx", ".test.tsx"));
  const routes = {
    "src/app/page.tsx": modules,
    "src/app/about/page.tsx": modules,
  };
  const files = ["src/app/page.tsx", "src/app/about/page.tsx", ...modules, ...tests];

  expect(structureProblems(files, graph(routes))).toEqual([]);
  expect(structureProblems([...files, "src/components/shell/Extra.tsx"], graph(routes))).toContain(
    "src/components/shell: 16 files. An area past 15 files has stopped describing its contents. Split it by the routes that use each module (RFC 0002 part 2).",
  );
});
