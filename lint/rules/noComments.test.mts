import { noComments } from "./noComments.mts";
import { ruleTester } from "./ruleTester.fixture.mts";

const message =
  "Comments drift from the code they describe, and disable comments switch checks off. Say it in a name instead: extract a function or constant named after the reason. Fix the rule violation instead of disabling it.";

ruleTester.run("no-comments", noComments, {
  valid: ['export const url = "https://example.com/#anchor"; export const path = "a//b";'],
  invalid: [
    {
      code: "// Wait for the sidebar to close.\nexport const delay = 200;",
      errors: [{ message, line: 1 }],
    },
    {
      code: "/* oxlint-disable no-console */\nexport const a = 1;\nexport const b = 2; /** total */",
      errors: [
        { message, line: 1 },
        { message, line: 3 },
      ],
    },
  ],
});
