import { dirname } from "node:path";

import { moduleFile } from "./moduleGraph.mts";
import { isTestOrFixture } from "./testPlacement.mts";

export type ImportsOf = (file: string) => string[];

const layers = new Set([
  "app",
  "components",
  "diagrams",
  "ui",
  "hooks",
  "content",
  "tokens",
  "lib",
  "testing",
]);
const rootFiles = new Set(["mdx-components.tsx"]);
const lessonRoute = "/lessons/[slug]";
const maxAreaFiles = 15;
const routeEntries =
  /\/(page|layout|not-found|error|loading|template|default|opengraph-image|twitter-image|icon|apple-icon|sitemap|robots|manifest|route)\.tsx?$/;

function routeOf(entry: string) {
  if (entry === "src/mdx-components.tsx") {
    return lessonRoute;
  }
  const route = dirname(entry).replace(/^src\/app/, "") || "/";
  return entry.endsWith("/not-found.tsx") ? `${route} (not found)` : route;
}

function routesByModule(files: readonly string[], importsOf: ImportsOf) {
  const routes = new Map<string, Set<string>>();
  const entries = files.filter(
    (file) => routeEntries.test(file) || file === "src/mdx-components.tsx",
  );
  for (const entry of entries) {
    const route = routeOf(entry);
    const seen = new Set<string>();
    const stack = [entry];
    while (stack.length > 0) {
      const file = stack.pop() ?? "";
      if (seen.has(file)) {
        continue;
      }
      seen.add(file);
      routes.set(file, (routes.get(file) ?? new Set()).add(route));
      stack.push(...importsOf(file));
    }
  }
  return routes;
}

function checkHome(file: string): string | undefined {
  const [, top, area, rest] = file.split("/");
  if (top === undefined || (!layers.has(top) && !rootFiles.has(top))) {
    return `${file}: src/${top} is not a layer. Put the file in one of: ${[...layers].join(", ")} (RFC 0002 part 2).`;
  }
  if (top === "components" && rest === undefined) {
    return `${file}: shared page parts live in an area folder, src/components/<area>/ (RFC 0002 part 2).`;
  }
  if (top === "components" && area !== undefined && file.split("/").length > 4) {
    return `${file}: areas are flat. Move the file directly into src/components/${area}/.`;
  }
  return undefined;
}

function checkAppFolders(file: string): string | undefined {
  const folders = dirname(file).split("/").slice(2);
  const isRouteEntry = routeEntries.test(file) || file.endsWith(".css") || !moduleFile.test(file);
  if (isTestOrFixture(file)) {
    return undefined;
  }
  const inParts = folders.some((folder) => folder.startsWith("_"));
  if (!isRouteEntry && !inParts) {
    return `${file}: only routes and Next.js special files sit in a route folder. Move route-only modules into ./_parts/ (RFC 0002 part 3).`;
  }
  return undefined;
}

function checkAreaSizes(files: readonly string[]) {
  const sizes = new Map<string, number>();
  const parts = files.filter(
    (path) => path.startsWith("src/components/") && !isTestOrFixture(path),
  );
  for (const file of parts) {
    const area = file.split("/")[2] ?? "";
    sizes.set(area, (sizes.get(area) ?? 0) + 1);
  }
  return [...sizes]
    .filter(([, size]) => size > maxAreaFiles)
    .map(
      ([area, size]) =>
        `src/components/${area}: ${size} files. An area past ${maxAreaFiles} files has stopped describing its contents. Split it by the routes that use each module (RFC 0002 part 2).`,
    );
}

function checkUsage(file: string, routes: Map<string, Set<string>>): string | undefined {
  const used = [...(routes.get(file) ?? [])];
  if (used.length === 0) {
    return `${file}: no route imports this module. Delete it, or import it where it is needed.`;
  }
  if (used.length === 1) {
    return `${file}: only ${used[0]} uses this module. Move it to that route's _parts/ folder (RFC 0002 part 3).`;
  }
  return undefined;
}

export function structureProblems(files: readonly string[], importsOf: ImportsOf) {
  const modules = files.filter((file) => moduleFile.test(file) && !isTestOrFixture(file));
  const routes = routesByModule(modules, importsOf);
  const components = modules.filter((file) => file.startsWith("src/components/"));
  return [
    ...files.map((file) => checkHome(file)),
    ...files.filter((file) => file.startsWith("src/app/")).map((file) => checkAppFolders(file)),
    ...checkAreaSizes(files),
    ...components.map((file) => checkUsage(file, routes)),
  ].filter((problem): problem is string => problem !== undefined);
}
