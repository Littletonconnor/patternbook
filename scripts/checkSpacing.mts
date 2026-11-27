import { readFileSync, writeFileSync } from "node:fs";

import { moduleFile, walk } from "./moduleGraph.mts";
import { compareSpacing, countRawSpacing } from "./spacing.mts";
import type { Counts } from "./spacing.mts";
import { isTestOrFixture } from "./testPlacement.mts";

const baselinePath = "scripts/spacingBaseline.json";

function currentCounts() {
  const files = walk("src").filter(
    (file) => moduleFile.test(file) && !isTestOrFixture(file) && !file.startsWith("src/tokens/"),
  );
  const counts: Counts = {};
  for (const file of files.toSorted()) {
    const count = countRawSpacing(file, readFileSync(file, "utf8"));
    if (count > 0) {
      counts[file] = count;
    }
  }
  return counts;
}

function readBaseline(): Counts {
  const parsed: unknown = JSON.parse(readFileSync(baselinePath, "utf8"));
  if (typeof parsed !== "object" || parsed === null) {
    return {};
  }
  const entries: [string, unknown][] = Object.entries(parsed);
  return Object.fromEntries(
    entries.filter((entry): entry is [string, number] => typeof entry[1] === "number"),
  );
}

function writeBaseline(counts: Counts) {
  writeFileSync(baselinePath, `${JSON.stringify(counts, null, 2)}\n`);
}

function check() {
  const counts = currentCounts();
  if (process.argv.includes("--init")) {
    writeBaseline(counts);
    return [];
  }
  const { problems, lowered } = compareSpacing(counts, readBaseline());
  if (lowered) {
    writeBaseline(counts);
    process.stdout.write(`Raw spacing went down. Lowered ${baselinePath}; commit it.\n`);
  }
  return problems;
}

const problems = check();
for (const problem of problems) {
  process.stderr.write(`${problem}\n`);
}
process.exitCode = problems.length > 0 ? 1 : 0;
