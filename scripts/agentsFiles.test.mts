import { expect, test } from "vitest";

import { agentsFileProblems, mentionedPaths } from "./agentsFiles.mts";

const repo = new Set(["TODO.md", "rfc/TEMPLATE.md", "rfc/assets", "src/content/catalog.ts"]);
const exists = (path: string) => repo.has(path);

test("mentionedPaths picks out code spans that look like files or folders", () => {
  const text =
    "Copy `TEMPLATE.md` to `NNNN-short-slug.md`, add it to `rfc/assets/`, run `verify`, cite `[[4]](#sources)`, import `@/content/catalog` and run `npm run new:rfc`.";

  expect(mentionedPaths(text)).toEqual(["TEMPLATE.md", "rfc/assets/"]);
});

test("accepts paths that exist next to the file or at the repository root", () => {
  const file = {
    path: "rfc/AGENTS.md",
    text: "Copy `TEMPLATE.md`, put diagrams in `rfc/assets/`, and add work to `TODO.md`.",
  };

  expect(agentsFileProblems([file], exists)).toEqual([]);
});

test("rejects a path that exists nowhere", () => {
  const file = { path: "AGENTS.md", text: "Read `scripts/oldGenerator.mts` first." };

  expect(agentsFileProblems([file], exists)).toEqual([
    "AGENTS.md: mentions `scripts/oldGenerator.mts`, which does not exist next to this file or at the repository root. Update the path or remove the mention.",
  ]);
});

test("accepts a file at the line limit and rejects one over it", () => {
  const atLimit = { path: "AGENTS.md", text: "line\n".repeat(150) };
  const overLimit = { path: "AGENTS.md", text: "line\n".repeat(151) };

  expect(agentsFileProblems([atLimit], exists)).toEqual([]);
  expect(agentsFileProblems([overLimit], exists)).toEqual([
    "AGENTS.md: 151 lines, over the limit of 150. Every line is loaded on every task, so move detail that only some tasks need into a file the agent reads when it needs it.",
  ]);
});
