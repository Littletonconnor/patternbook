import { importsOf, notOurs, walk } from "./moduleGraph.mts";
import { structureProblems } from "./structure.mts";
import { testPlacementProblems } from "./testPlacement.mts";

const problems = [
  ...structureProblems(walk("src"), (file) => importsOf(file).map((found) => found.path)),
  ...testPlacementProblems(walk(".", notOurs)),
];
for (const problem of problems) {
  process.stderr.write(`${problem}\n`);
}
process.exitCode = problems.length > 0 ? 1 : 0;
