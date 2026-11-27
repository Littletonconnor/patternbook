import { ruleTester } from "../../../lint/rules/ruleTester.fixture.mts";
import { ruleName } from "./rule.mts";

const message = "What is wrong. What to write instead (RFC NNNN part N).";

ruleTester.run("rule-name", ruleName, {
  valid: [{ code: "export const allowed = 1;", filename: "src/lib/allowed.ts" }],
  invalid: [
    {
      code: "export const banned = 1;",
      filename: "src/lib/banned.ts",
      errors: [{ message }],
    },
  ],
});
