import fc from "fast-check";
import { expect, test } from "vitest";

import { decodeStored } from "./useLocalStorage";

const keep = (stored: unknown) => stored;

test("returns undefined when nothing is stored", () => {
  expect(decodeStored(null, keep)).toBeUndefined();
});

test("parses stored JSON before handing it to the parser", () => {
  expect(decodeStored('{"width":300}', keep)).toEqual({ width: 300 });
});

test("hands a value that is not JSON to the parser as the raw string", () => {
  expect(decodeStored("core", keep)).toBe("core");
});

test("passes the parser's rejection through as undefined", () => {
  expect(decodeStored("[1,2]", () => undefined)).toBeUndefined();
});

test("gives back any JSON value that was stored", () => {
  fc.assert(
    fc.property(fc.json(), (raw) => {
      expect(decodeStored(raw, keep)).toEqual(JSON.parse(raw));
    }),
  );
});

test("never throws, whatever string is stored", () => {
  fc.assert(
    fc.property(fc.string(), (raw) => {
      expect(() => decodeStored(raw, keep)).not.toThrow();
    }),
  );
});
