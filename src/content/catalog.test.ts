import { expect, test } from "vitest";

import {
  formatMinutes,
  isLessonSlug,
  lessonBySlug,
  lessonSlugFromPath,
  lessons,
  neighbours,
  starterLessons,
  topicOf,
  topics,
  totals,
} from "./catalog";

test("lesson numbers run from 1 with no gaps, in catalog order", () => {
  lessons.forEach((lesson, index) => {
    expect(lesson.number, `lesson "${lesson.slug}"`).toBe(index + 1);
  });
});

test("lesson slugs are unique", () => {
  const seen = new Set<string>();
  for (const lesson of lessons) {
    expect(seen.has(lesson.slug), `lesson "${lesson.slug}" appears twice`).toBe(false);
    seen.add(lesson.slug);
  }
});

test("topic slugs are unique and never reuse a lesson slug", () => {
  const lessonSlugs = new Set<string>(lessons.map((lesson) => lesson.slug));
  const seen = new Set<string>();
  for (const topic of topics) {
    expect(seen.has(topic.slug), `topic "${topic.slug}" appears twice`).toBe(false);
    expect(lessonSlugs.has(topic.slug), `topic "${topic.slug}" is also a lesson slug`).toBe(false);
    seen.add(topic.slug);
  }
});

test("slugs are lowercase words joined by hyphens", () => {
  for (const { slug } of [...topics, ...lessons]) {
    expect(slug, `slug "${slug}"`).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  }
});

test("every lesson takes a positive whole number of minutes", () => {
  for (const lesson of lessons) {
    expect(Number.isInteger(lesson.minutes), `lesson "${lesson.slug}"`).toBe(true);
    expect(lesson.minutes, `lesson "${lesson.slug}"`).toBeGreaterThan(0);
  }
});

test("there are starter lessons", () => {
  expect(starterLessons.length).toBeGreaterThan(0);
});

test("every lesson belongs to the topic that lists it", () => {
  for (const topic of topics) {
    for (const lesson of topic.lessons) {
      expect(topicOf(lesson).slug, `lesson "${lesson.slug}"`).toBe(topic.slug);
    }
  }
});

test("the first lesson has no previous lesson and the last has no next", () => {
  expect(neighbours({ slug: "what-happens-when-you-type-a-url" }).previous).toBeUndefined();
  expect(neighbours({ slug: "agent-first-repositories" }).next).toBeUndefined();
});

test("neighbours cross topic boundaries in catalog order", () => {
  expect(neighbours({ slug: "the-event-loop" }).next).toBe(
    lessonBySlug("what-the-shell-actually-does"),
  );
  expect(neighbours({ slug: "what-the-shell-actually-does" }).previous).toBe(
    lessonBySlug("the-event-loop"),
  );
});

test.each([
  ["/lessons/dns", "dns"],
  ["/lessons/dns/", "dns"],
  ["/lessons/not-a-lesson", undefined],
  ["/diagrams", undefined],
  ["/", undefined],
])("lessonSlugFromPath(%s) is %s", (path, expected) => {
  expect(lessonSlugFromPath(path)).toBe(expected);
});

test("isLessonSlug accepts catalog slugs only", () => {
  expect(isLessonSlug("dns")).toBe(true);
  expect(isLessonSlug("how-the-web-works")).toBe(false);
  expect(isLessonSlug("DNS")).toBe(false);
});

test.each([
  [0, "0 min"],
  [7, "7 min"],
  [59, "59 min"],
  [60, "1h 00m"],
  [61, "1h 01m"],
  [135, "2h 15m"],
])("formatMinutes(%i) is %s", (minutes, expected) => {
  expect(formatMinutes(minutes)).toBe(expected);
});

test("totals counts lessons and adds up their minutes", () => {
  expect(totals([])).toEqual({ lessons: 0, minutes: 0 });
  expect(totals([lessonBySlug("dns"), lessonBySlug("tcp-ports-and-tls")])).toEqual({
    lessons: 2,
    minutes: 15,
  });
});
