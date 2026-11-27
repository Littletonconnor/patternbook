import { noEnum } from "./noEnum.mts";
import { ruleTester } from "./ruleTester.fixture.mts";

ruleTester.run("no-enum", noEnum, {
  valid: [
    'export type Level = "foundations" | "core" | "advanced";',
    'export const levels = { core: "core" } as const;',
  ],
  invalid: [
    {
      code: "enum Level { Foundations, Core }",
      errors: [
        {
          message:
            "Enums generate runtime code and can't be run by Node's type stripping. Use a union of string literals, or an `as const` object with a type derived from it.",
        },
      ],
    },
  ],
});
