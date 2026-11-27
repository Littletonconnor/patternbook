import { expect, test } from "vitest";

import { headingId } from "./headingId";

test.each([
  ["Why offsets drift", "why-offsets-drift"],
  ["Offset vs. cursor", "offset-vs-cursor"],
  ["  The `LIMIT` clause  ", "the-limit-clause"],
  ["HTTP/2 and HTTP/3", "http-2-and-http-3"],
  ["What's next?", "what-s-next"],
  ["", ""],
])("headingId(%j) is %j", (text, expected) => {
  expect(headingId(text)).toBe(expected);
});
