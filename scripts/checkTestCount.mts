import { existsSync, readFileSync, writeFileSync } from "node:fs";

import { walk } from "./moduleGraph.mts";
import { compareTestCount, parseTestRun, testCountFile } from "./testCount.mts";

const baselinePath = "scripts/testCountBaseline.json";
const unitTest = /\.test\.(ts|tsx|mts)$/;

function readJson(path: string): unknown {
  return existsSync(path) ? JSON.parse(readFileSync(path, "utf8")) : undefined;
}

function readBaseline() {
  const parsed = readJson(baselinePath);
  return typeof parsed === "object" &&
    parsed !== null &&
    "tests" in parsed &&
    typeof parsed.tests === "number"
    ? parsed.tests
    : 0;
}

const testFiles = ["src", "lint", "scripts"]
  .flatMap((dir) => walk(dir))
  .filter((file) => unitTest.test(file) && !file.startsWith("scripts/templates/"));
const run = parseTestRun(readJson(testCountFile));
const { problem, raised } = compareTestCount(run, testFiles.length, readBaseline());
if (raised && run !== undefined) {
  writeFileSync(baselinePath, `${JSON.stringify({ tests: run.tests }, null, 2)}\n`);
  process.stdout.write(
    `The test count went up to ${run.tests}. Raised ${baselinePath}; commit it.\n`,
  );
}
if (problem !== undefined) {
  process.stderr.write(`${problem}\n`);
}
process.exitCode = problem === undefined ? 0 : 1;
