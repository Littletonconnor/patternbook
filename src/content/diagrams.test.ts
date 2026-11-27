import { expect, test } from "vitest";

import { lessonBySlug } from "./catalog";
import { diagramLesson, diagrams } from "./diagrams";

test("diagram numbers are unique", () => {
  const seen = new Set<string>();
  for (const diagram of diagrams) {
    expect(seen.has(diagram.number), `diagram ${diagram.number} appears twice`).toBe(false);
    seen.add(diagram.number);
  }
});

test("each diagram is numbered after its lesson, as <lesson>.<n>", () => {
  for (const diagram of diagrams) {
    const lesson = lessonBySlug(diagram.lesson);
    expect(diagram.number, `diagram "${diagram.title}"`).toMatch(
      new RegExp(String.raw`^${lesson.number}\.[1-9]\d*$`),
    );
  }
});

test("diagramLesson returns the lesson the diagram belongs to", () => {
  expect(
    diagramLesson({ number: "2.1", kind: "flow", title: "Resolve a name", lesson: "dns" }),
  ).toBe(lessonBySlug("dns"));
});
