import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { basename } from "node:path";
import { importsOf, moduleFile, walk } from "./moduleGraph.mts";
import { expect, finish, readArgs, run } from "./scaffold.mts";

const usage = "npm run promote -- src/app/<route>/_parts/Module.tsx area";

function importersOf(target: string) {
  const modules = walk("src").filter((file) => moduleFile.test(file));
  return modules.flatMap((file) => {
    const specifiers = importsOf(file)
      .filter((entry) => entry.path === target)
      .map((entry) => entry.specifier);
    return specifiers.length > 0 ? [{ file, specifiers }] : [];
  });
}

function rewrite(file: string, specifiers: string[], to: string) {
  let text = readFileSync(file, "utf8");
  for (const specifier of specifiers) {
    text = text.replaceAll(`"${specifier}"`, `"${to}"`);
  }
  writeFileSync(file, text);
}

run(() => {
  const [from = "", area = ""] = readArgs(usage, 2);
  expect(/^src\/app\/(.+\/)?_parts\/[^/]+\.tsx?$/.test(from), `Usage: ${usage}`);
  expect(existsSync(from), `${from} does not exist.`);
  expect(/^[a-z]+$/.test(area), `${area} must be one lowercase word, such as shell or lesson.`);
  const siblings = importsOf(from).filter((entry) => entry.specifier.startsWith("./"));
  expect(
    siblings.length === 0,
    `${from} imports ${siblings.map((entry) => entry.path).join(", ")} from its own _parts folder. Promote those first.`,
  );
  const to = `src/components/${area}/${basename(from)}`;
  expect(!existsSync(to), `${to} already exists.`);
  const importers = importersOf(from);
  mkdirSync(`src/components/${area}`, { recursive: true });
  renameSync(from, to);
  const specifier = `@/${to.slice("src/".length).replace(moduleFile, "")}`;
  for (const importer of importers) {
    rewrite(importer.file, importer.specifiers, specifier);
  }
  finish(
    [to],
    importers.map((importer) => importer.file),
  );
});
