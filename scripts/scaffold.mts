import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

export const pascalName = /^[A-Z][A-Za-z0-9]*$/;
export const kebabName = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;

export class UsageError extends Error {}

export function readArgs(usage: string, count: number) {
  const args = process.argv.slice(2);
  if (args.length !== count) {
    throw new UsageError(`Usage: ${usage}`);
  }
  return args;
}

export function expect(ok: boolean, message: string) {
  if (!ok) {
    throw new UsageError(message);
  }
}

export function pascalFromKebab(kebab: string) {
  return kebab.replaceAll(/(?:^|-)([a-z0-9])/g, (_, letter: string) => letter.toUpperCase());
}

export function camelFromPascal(pascal: string) {
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

export function titleFromKebab(kebab: string) {
  const words = kebab.replaceAll("-", " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}

export function fromTemplate(name: string, replacements: [string, string][]) {
  let text = readFileSync(join("scripts", "templates", name), "utf8");
  for (const [from, to] of replacements) {
    text = text.replaceAll(from, to);
  }
  return text;
}

export function createFile(path: string, content: string) {
  expect(!existsSync(path), `${path} already exists.`);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
}

export function editFile(path: string, edit: (text: string) => string) {
  const before = readFileSync(path, "utf8");
  const after = edit(before);
  expect(after !== before, `Could not find where to register the new code in ${path}.`);
  writeFileSync(path, after);
}

export function insertBefore(text: string, marker: string, addition: string) {
  const at = text.lastIndexOf(marker);
  return at === -1 ? text : text.slice(0, at) + addition + text.slice(at);
}

export function insertAfterLine(text: string, pattern: RegExp, addition: string) {
  const lines = text.split("\n");
  const last = lines.findLastIndex((line) => pattern.test(line));
  if (last === -1) {
    return text;
  }
  lines.splice(last + 1, 0, addition);
  return lines.join("\n");
}

export function addImport(text: string, line: string) {
  return insertAfterLine(text, /^import /, line);
}

export function finish(created: string[], updated: string[]) {
  execFileSync("npx", ["oxfmt", ...created, ...updated], {
    stdio: "inherit",
  });
  const lines = [
    ...created.map((path) => `created  ${path}`),
    ...updated.map((path) => `updated  ${path}`),
    "Fill in the generated code, then run npm run verify.",
  ];
  process.stdout.write(`${lines.join("\n")}\n`);
}

export function run(generate: () => void) {
  try {
    generate();
  } catch (error) {
    if (!(error instanceof UsageError)) {
      throw error;
    }
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
}
