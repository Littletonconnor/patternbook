export const testCountFile = "node_modules/.cache/patternbook/testCount.json";

export type TestRun = { files: number; tests: number };

export function parseTestRun(value: unknown): TestRun | undefined {
  if (typeof value !== "object" || value === null || !("files" in value) || !("tests" in value)) {
    return undefined;
  }
  const { files, tests } = value;
  return typeof files === "number" && typeof tests === "number" ? { files, tests } : undefined;
}

export function compareTestCount(run: TestRun | undefined, testFiles: number, baseline: number) {
  if (run?.files !== testFiles) {
    return {
      problem: "No record of a full test run. Run npm run test, then npm run test:count.",
      raised: false,
    };
  }
  if (run.tests < baseline) {
    return {
      problem: `${run.tests} tests, down from ${baseline}. Restore the deleted tests. If removing them is intended, lower scripts/testCountBaseline.json in the same change and say why in its description.`,
      raised: false,
    };
  }
  return { problem: undefined, raised: run.tests > baseline };
}
