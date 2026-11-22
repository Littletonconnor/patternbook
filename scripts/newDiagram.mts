import { existsSync } from "node:fs";
import { diagramCount, diagramKinds, lessonNumber } from "./catalogSource.mts";
import {
  addImport,
  createFile,
  editFile,
  expect,
  finish,
  fromTemplate,
  insertBefore,
  pascalName,
  readArgs,
  run,
} from "./scaffold.mts";

const usage = 'npm run new:diagram -- lesson-slug Name kind "Title"';
const index = "src/content/diagrams.ts";

function withImport(text: string, line: string) {
  return /^import /m.test(text) ? addImport(text, line) : `${line}\n\n${text}`;
}

run(() => {
  const [slug = "", name = "", kind = "", title = ""] = readArgs(usage, 4);
  const lesson = lessonNumber(slug);
  const mdx = `src/content/lessons/${slug}/index.mdx`;
  expect(existsSync(mdx), `Create the lesson first: npm run new:lesson -- ${slug}`);
  expect(pascalName.test(name), `${name} must be PascalCase, such as OffsetRace.`);
  const kinds = diagramKinds();
  expect(kinds.includes(kind), `kind must be one of: ${kinds.join(", ")}.`);
  const number = `${lesson ?? 0}.${diagramCount(slug) + 1}`;
  const file = `src/content/lessons/${slug}/${name}.tsx`;
  createFile(
    file,
    fromTemplate("lesson/Diagram.tsx", [
      ["Diagram title", title],
      ["Diagram", name],
    ]),
  );
  const entry = { number, kind, title, lesson: slug };
  editFile(index, (text) => insertBefore(text, "\n];", `\n  ${JSON.stringify(entry)},`));
  editFile(
    mdx,
    (text) => `${withImport(text, `import { ${name} } from "./${name}";`)}\n<${name} />\n`,
  );
  finish([file], [index, mdx]);
});
