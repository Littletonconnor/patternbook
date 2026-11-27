import { expect, test } from "vitest";

import { compareTestCount, parseTestRun } from "./testCount.mts";

test("parseTestRun reads a recorded run", () => {
  expect(parseTestRun({ files: 19, tests: 139 })).toEqual({ files: 19, tests: 139 });
});

test.each([[undefined], [null], ["139"], [{ tests: 139 }], [{ files: "19", tests: 139 }]])(
  "parseTestRun rejects %j",
  (value) => {
    expect(parseTestRun(value)).toBeUndefined();
  },
);

test("passes when the count matches the baseline", () => {
  expect(compareTestCount({ files: 19, tests: 139 }, 19, 139)).toEqual({
    problem: undefined,
    raised: false,
  });
});

test("raises the baseline when the count grows", () => {
  expect(compareTestCount({ files: 20, tests: 142 }, 20, 139)).toEqual({
    problem: undefined,
    raised: true,
  });
});

test("fails when the count drops below the baseline", () => {
  expect(compareTestCount({ files: 19, tests: 137 }, 19, 139)).toEqual({
    problem:
      "137 tests, down from 139. Restore the deleted tests. If removing them is intended, lower scripts/testCountBaseline.json in the same change and say why in its description.",
    raised: false,
  });
});

test("fails when the last run did not cover every test file", () => {
  const problem = "No record of a full test run. Run npm run test, then npm run test:count.";

  expect(compareTestCount({ files: 3, tests: 12 }, 19, 139)).toEqual({ problem, raised: false });
  expect(compareTestCount(undefined, 19, 139)).toEqual({ problem, raised: false });
});
