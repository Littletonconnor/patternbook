import { expect, test } from "vitest";

import {
  addImport,
  camelFromPascal,
  insertAfterLine,
  insertBefore,
  kebabName,
  pascalFromKebab,
  pascalName,
  titleFromKebab,
} from "./scaffold.mts";

test.each([
  ["no-enum", "NoEnum"],
  ["icons-through-icon", "IconsThroughIcon"],
  ["http2-push", "Http2Push"],
  ["button", "Button"],
])("pascalFromKebab(%s) is %s", (kebab, expected) => {
  expect(pascalFromKebab(kebab)).toBe(expected);
});

test("camelFromPascal lowers only the first letter", () => {
  expect(camelFromPascal("IconsThroughIcon")).toBe("iconsThroughIcon");
});

test("titleFromKebab gives a sentence-case title", () => {
  expect(titleFromKebab("offset-vs-cursor-pagination")).toBe("Offset vs cursor pagination");
});

test.each([
  ["no-enum", true],
  ["http2-push", true],
  ["NoEnum", false],
  ["no--enum", false],
  ["-no-enum", false],
  ["no_enum", false],
])("kebabName accepts %s: %s", (name, expected) => {
  expect(kebabName.test(name)).toBe(expected);
});

test.each([
  ["ToggleGroup", true],
  ["Kbd2", true],
  ["toggleGroup", false],
  ["Toggle-Group", false],
])("pascalName accepts %s: %s", (name, expected) => {
  expect(pascalName.test(name)).toBe(expected);
});

test("insertBefore adds text before the last occurrence of the marker", () => {
  expect(insertBefore("a },\n b },\n};", " },\n};", "\n c")).toBe("a },\n b\n c },\n};");
});

test("insertBefore leaves the text unchanged when the marker is missing", () => {
  expect(insertBefore("const a = 1;", "};", "x")).toBe("const a = 1;");
});

test("insertAfterLine adds a line after the last matching line", () => {
  const config =
    '  "patternbook/no-enum": "error",\n  "patternbook/no-comments": "error",\n  max: 1,';

  expect(insertAfterLine(config, /^ {2}"patternbook\//, '  "patternbook/new": "error",')).toBe(
    '  "patternbook/no-enum": "error",\n  "patternbook/no-comments": "error",\n  "patternbook/new": "error",\n  max: 1,',
  );
});

test("insertAfterLine leaves the text unchanged when no line matches", () => {
  expect(insertAfterLine("const a = 1;", /^import /, "import b;")).toBe("const a = 1;");
});

test("addImport adds an import after the last import", () => {
  const plugin = 'import { a } from "./a.mts";\nimport { b } from "./b.mts";\n\nconst plugin = {};';

  expect(addImport(plugin, 'import { c } from "./c.mts";')).toBe(
    'import { a } from "./a.mts";\nimport { b } from "./b.mts";\nimport { c } from "./c.mts";\n\nconst plugin = {};',
  );
});
