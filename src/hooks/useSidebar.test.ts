import fc from "fast-check";
import { expect, test } from "vitest";

import { decodeStored } from "./useLocalStorage";
import { SIDEBAR, clampWidth, parseSidebar } from "./useSidebar";

test("reads a stored width and collapsed state", () => {
  expect(parseSidebar({ width: 300, collapsed: true })).toEqual({ width: 300, collapsed: true });
});

test("treats a missing or non-boolean collapsed flag as open", () => {
  expect([{ width: 300 }, { width: 300, collapsed: "true" }].map(parseSidebar)).toEqual([
    { width: 300, collapsed: false },
    { width: 300, collapsed: false },
  ]);
});

test("clamps a stored width to the sidebar's limits", () => {
  expect([{ width: 10 }, { width: 9000 }, { width: 250.6 }].map(parseSidebar)).toEqual([
    { width: 200, collapsed: false },
    { width: 420, collapsed: false },
    { width: 251, collapsed: false },
  ]);
});

test("rejects a stored value without a numeric width", () => {
  expect([null, 300, "300", {}, { width: "300" }, [300]].map(parseSidebar)).toEqual([
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
  ]);
});

test("keeps any stored width within the limits, and the collapsed flag a boolean", () => {
  const stored = fc.record({ width: fc.double({ noNaN: true }), collapsed: fc.jsonValue() });
  fc.assert(
    fc.property(stored, (value) => {
      expect(parseSidebar(value)?.collapsed).toBe(value.collapsed === true);
      expect(parseSidebar(value)?.width).toBeGreaterThanOrEqual(SIDEBAR.min);
      expect(parseSidebar(value)?.width).toBeLessThanOrEqual(SIDEBAR.max);
    }),
  );
});

test("reads back every state it writes", () => {
  const state = fc.record({
    width: fc.integer({ min: SIDEBAR.min, max: SIDEBAR.max }),
    collapsed: fc.boolean(),
  });
  fc.assert(
    fc.property(state, (written) => {
      expect(decodeStored(JSON.stringify(written), parseSidebar)).toEqual(written);
    }),
  );
});

test("clamps any width to a whole number within the limits, and leaves it there", () => {
  fc.assert(
    fc.property(fc.double({ noNaN: true, noDefaultInfinity: true }), (width) => {
      const clamped = clampWidth(width);
      expect(Number.isInteger(clamped)).toBe(true);
      expect(clamped).toBeGreaterThanOrEqual(SIDEBAR.min);
      expect(clamped).toBeLessThanOrEqual(SIDEBAR.max);
      expect(clampWidth(clamped)).toBe(clamped);
    }),
  );
});
