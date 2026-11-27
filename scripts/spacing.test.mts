import { expect, test } from "vitest";

import { compareSpacing, countRawSpacing } from "./spacing.mts";

test.each([
  ["padding: space.md", 0],
  ["padding: 0", 0],
  ["padding: 12", 1],
  ["marginTop: -4", 1],
  ['padding: "8px 12px"', 2],
  ['gap: "0.5rem"', 1],
  ["inset: `${space.sm} 3px`", 1],
  ['paddingInline: { default: 16, "@media (min-width: 768px)": space.lg }', 1],
  ['width: 240, borderRadius: "4px"', 0],
])("counts %s as %i raw spacing values", (properties, expected) => {
  expect(countRawSpacing("Card.tsx", `const styles = { root: { ${properties} } };`)).toBe(expected);
});

test("passes and keeps the baseline when counts match it", () => {
  expect(compareSpacing({ "src/ui/Badge.tsx": 2 }, { "src/ui/Badge.tsx": 2 })).toEqual({
    problems: [],
    lowered: false,
  });
});

test("lowers the baseline when a count goes down", () => {
  expect(compareSpacing({ "src/ui/Badge.tsx": 1 }, { "src/ui/Badge.tsx": 2 })).toEqual({
    problems: [],
    lowered: true,
  });
});

test("fails a file whose count grows, including a file not in the baseline", () => {
  expect(
    compareSpacing({ "src/ui/Badge.tsx": 3, "src/ui/Kbd.tsx": 1 }, { "src/ui/Badge.tsx": 2 }),
  ).toEqual({
    problems: [
      "src/ui/Badge.tsx: 3 raw spacing values, up from 2. Use space from @/tokens/tokens.stylex for padding, margin, gap and inset.",
      "src/ui/Kbd.tsx: 1 raw spacing values, up from 0. Use space from @/tokens/tokens.stylex for padding, margin, gap and inset.",
    ],
    lowered: false,
  });
});
