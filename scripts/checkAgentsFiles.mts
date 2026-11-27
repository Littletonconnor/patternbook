import { existsSync, readFileSync } from "node:fs";
import { basename } from "node:path";

import { agentsFileProblems } from "./agentsFiles.mts";
import { notOurs, walk } from "./moduleGraph.mts";

const files = walk(".", notOurs)
  .filter((path) => basename(path) === "AGENTS.md")
  .map((path) => ({ path, text: readFileSync(path, "utf8") }));
const problems = agentsFileProblems(files, existsSync);
for (const problem of problems) {
  process.stderr.write(`${problem}\n`);
}
process.exitCode = problems.length > 0 ? 1 : 0;
