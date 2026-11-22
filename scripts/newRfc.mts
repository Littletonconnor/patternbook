import { readdirSync } from "node:fs";

import { createFile, expect, finish, fromTemplate, kebabName, readArgs, run } from "./scaffold.mts";
import { titleFromKebab } from "./scaffold.mts";

const firstFreeNumber = 8;

function nextNumber() {
  const taken = readdirSync("rfc").flatMap((name) => {
    const match = /^(\d{4})-/.exec(name);
    return match ? [Number(match[1])] : [];
  });
  return Math.max(firstFreeNumber - 1, ...taken) + 1;
}

run(() => {
  const [slug = ""] = readArgs("npm run new:rfc -- short-slug", 1);
  expect(kebabName.test(slug), `${slug} must be kebab-case, such as data-fetching.`);
  const number = String(nextNumber()).padStart(4, "0");
  const file = `rfc/${number}-${slug}.md`;
  createFile(
    file,
    fromTemplate("../../rfc/TEMPLATE.md", [
      ["# RFC NNNN: Title", `# RFC ${number}: ${titleFromKebab(slug)}`],
    ]),
  );
  finish([file], []);
});
