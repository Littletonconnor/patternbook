import fc from "fast-check";
import { expect, test } from "vitest";

import { isLessonSlug, lessons } from "@/content/catalog";

import { decodeStored } from "./useLocalStorage";
import { parseReadLessons } from "./useReadLessons";

const slugs = lessons.map((lesson) => lesson.slug);

test("keeps the slugs of real lessons", () => {
  expect(parseReadLessons(["dns", "tcp-ports-and-tls"])).toEqual(["dns", "tcp-ports-and-tls"]);
});

test("drops unknown slugs and entries that are not strings", () => {
  expect(parseReadLessons(["dns", "removed-lesson", 3, null, { slug: "dns" }])).toEqual(["dns"]);
});

test("rejects a stored value that is not a list", () => {
  expect([null, "dns", 1, { dns: true }].map(parseReadLessons)).toEqual([
    undefined,
    undefined,
    undefined,
    undefined,
  ]);
});

test("returns only real lesson slugs, whatever list is stored", () => {
  fc.assert(
    fc.property(fc.array(fc.oneof(fc.constantFrom(...slugs), fc.jsonValue())), (stored) => {
      expect(parseReadLessons(stored)?.every((slug) => isLessonSlug(slug))).toBe(true);
    }),
  );
});

test("reads back every list of read lessons it writes", () => {
  fc.assert(
    fc.property(fc.uniqueArray(fc.constantFrom(...slugs)), (read) => {
      expect(decodeStored(JSON.stringify(read), parseReadLessons)).toEqual(read);
    }),
  );
});
