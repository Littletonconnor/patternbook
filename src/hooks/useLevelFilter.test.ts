import fc from "fast-check";
import { expect, test } from "vitest";

import { levelFilterOptions, parseLevelFilter } from "./useLevelFilter";
import { decodeStored } from "./useLocalStorage";

const filters = levelFilterOptions.map((option) => option.value);

test("accepts each level filter", () => {
  expect(filters.map(parseLevelFilter)).toEqual(["all", "foundations", "core", "advanced"]);
});

test("rejects other strings, other casing and other types", () => {
  expect(
    ["", "Core", "expert", 1, null, ["core"], { level: "core" }].map(parseLevelFilter),
  ).toEqual([undefined, undefined, undefined, undefined, undefined, undefined, undefined]);
});

test("rejects any stored value that is not a level filter", () => {
  const notAFilter = fc.jsonValue().filter((value) => !filters.some((filter) => filter === value));
  fc.assert(
    fc.property(notAFilter, (value) => {
      expect(parseLevelFilter(value)).toBeUndefined();
    }),
  );
});

test("reads back every level filter it writes", () => {
  fc.assert(
    fc.property(fc.constantFrom(...filters), (filter) => {
      expect(decodeStored(JSON.stringify(filter), parseLevelFilter)).toBe(filter);
    }),
  );
});
