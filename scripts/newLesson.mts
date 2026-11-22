import { lessonNumber } from "./catalogSource.mts";
import { createFile, editFile, expect, finish, fromTemplate, readArgs, run } from "./scaffold.mts";

const registry = "src/content/lessons/registry.ts";

run(() => {
  const [slug = ""] = readArgs("npm run new:lesson -- slug", 1);
  expect(
    lessonNumber(slug) !== undefined,
    `${slug} is not in src/content/catalog.ts. Add the lesson to the catalog first.`,
  );
  const file = `src/content/lessons/${slug}/index.mdx`;
  createFile(file, fromTemplate("lesson/index.mdx", []));
  editFile(registry, (text) => {
    const end = text.lastIndexOf("}");
    const entry = `\n  "${slug}": () => import("./${slug}/index.mdx"),\n`;
    return text.slice(0, end) + entry + text.slice(end);
  });
  finish([file], [registry]);
});
