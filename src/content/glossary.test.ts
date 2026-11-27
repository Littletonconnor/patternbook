import { expect, test } from "vitest";

import { glossary } from "./glossary";

const entries = Object.entries(glossary);

test("glossary ids are lowercase words joined by hyphens", () => {
  for (const [id] of entries) {
    expect(id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  }
});

test("glossary terms are unique, ignoring case", () => {
  const seen = new Set<string>();
  for (const [id, { term }] of entries) {
    expect(seen.has(term.toLowerCase()), `term "${term}" (${id}) appears twice`).toBe(false);
    seen.add(term.toLowerCase());
  }
});

test("every definition is a full sentence", () => {
  for (const [id, { definition }] of entries) {
    expect(definition, `definition of "${id}"`).toMatch(/^[A-Z].*\.$/);
  }
});
