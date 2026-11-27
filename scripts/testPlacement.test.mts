import { expect, test } from "vitest";

import { isTestOrFixture, testPlacementProblems } from "./testPlacement.mts";

test.each([
  ["src/content/catalog.test.ts", true],
  ["src/components/lesson/Pager.test.tsx", true],
  ["lint/rules/ruleTester.fixture.mts", true],
  ["src/testing/repo.fixture.json", true],
  ["src/content/catalog.ts", false],
  ["e2e/readLesson.e2e.ts", false],
])("isTestOrFixture(%s) is %s", (file, expected) => {
  expect(isTestOrFixture(file)).toBe(expected);
});

test("accepts tests beside their source, end-to-end tests in e2e, and fixtures beside tests", () => {
  const files = [
    "src/content/catalog.ts",
    "src/content/catalog.test.ts",
    "src/components/lesson/Pager.tsx",
    "src/components/lesson/Pager.test.tsx",
    "src/app/api/signup/route.ts",
    "src/app/api/signup/route.test.ts",
    "lint/rules/noEnum.mts",
    "lint/rules/noEnum.test.mts",
    "lint/rules/ruleTester.fixture.mts",
    "src/testing/startTestDatabase.ts",
    "src/testing/repo.fixture.json",
    "e2e/readLesson.e2e.ts",
    "e2e/pages.ts",
  ];

  expect(testPlacementProblems(files)).toEqual([]);
});

test("rejects a test with no source file of the same name beside it", () => {
  expect(testPlacementProblems(["src/lib/money.test.ts", "src/lib/price.ts"])).toEqual([
    "src/lib/money.test.ts: no money.ts, money.tsx or money.mts beside it. A test sits beside the file it tests and shares its name; move it there, or delete it if that file is gone (RFC 0002 part 5).",
  ]);
});

test("rejects a test in a separate tests folder", () => {
  expect(testPlacementProblems(["tests/catalog.test.ts", "tests/catalog.ts"])).toEqual([
    "tests/catalog.test.ts: unit, integration and component tests sit beside the file they test, in src, lint or scripts. End-to-end tests go in e2e/ as <journey>.e2e.ts (RFC 0002 part 5).",
  ]);
});

test("rejects an end-to-end test outside e2e", () => {
  expect(testPlacementProblems(["src/app/lessons/[slug]/readLesson.e2e.ts"])).toEqual([
    "src/app/lessons/[slug]/readLesson.e2e.ts: end-to-end tests live in e2e/, one file per journey, because a journey crosses several routes (RFC 0002 part 5).",
  ]);
});

test("rejects a fixture with no test beside it outside src/testing", () => {
  expect(testPlacementProblems(["src/lib/repo.fixture.json", "src/lib/headingId.ts"])).toEqual([
    "src/lib/repo.fixture.json: a fixture sits beside the test that uses it, or in src/testing once tests in two folders need it (RFC 0002 part 5).",
  ]);
});
