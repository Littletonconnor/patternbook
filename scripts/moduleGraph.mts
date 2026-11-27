import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, normalize, relative } from "node:path";

export const moduleFile = /\.(ts|tsx|mts)$/;

export const notOurs: ReadonlySet<string> = new Set([
  "node_modules",
  ".git",
  ".next",
  "out",
  "build",
  "coverage",
  "test-results",
  "playwright-report",
]);

export function walk(dir: string, skip: ReadonlySet<string> = new Set()): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (skip.has(name)) {
      return [];
    }
    return statSync(path).isDirectory() ? walk(path, skip) : [relative(process.cwd(), path)];
  });
}

export function resolveImport(from: string, specifier: string): string | undefined {
  let base: string | undefined;
  if (specifier.startsWith("@/")) {
    base = join("src", specifier.slice(2));
  } else if (specifier.startsWith(".")) {
    base = normalize(join(dirname(from), specifier));
  }
  if (base === undefined) {
    return undefined;
  }
  return [".ts", ".tsx", ""].map((ext) => base + ext).find((path) => existsSync(path));
}

export type Import = { specifier: string; path: string };

export function importsOf(file: string): Import[] {
  const source = readFileSync(file, "utf8");
  const matches = [...source.matchAll(/(?:from|import)\s*\(?\s*["']([^"']+)["']/g)];
  return matches.flatMap((match) => {
    const specifier = match[1] ?? "";
    const path = resolveImport(file, specifier);
    return path !== undefined && moduleFile.test(path) ? [{ specifier, path }] : [];
  });
}
