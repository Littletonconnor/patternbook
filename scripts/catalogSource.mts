import { readFileSync } from "node:fs";

const catalog = "src/content/catalog.ts";
const diagramIndex = "src/content/diagrams.ts";

export function lessonNumber(slug: string) {
  const source = readFileSync(catalog, "utf8");
  const match = new RegExp(String.raw`number: (\d+),\s*slug: "${slug}"`).exec(source);
  return match?.[1];
}

export function diagramKinds() {
  const source = readFileSync(diagramIndex, "utf8");
  const block = /diagramKinds[^{]*\{([^}]*)\}/.exec(source)?.[1] ?? "";
  return [...block.matchAll(/^\s*(\w+):/gm)].map((match) => match[1] ?? "");
}

export function diagramCount(slug: string) {
  return readFileSync(diagramIndex, "utf8").split(`lesson: "${slug}"`).length - 1;
}
