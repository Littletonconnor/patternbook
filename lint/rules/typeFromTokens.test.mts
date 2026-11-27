import { ruleTester } from "./ruleTester.fixture.mts";
import { typeFromTokens } from "./typeFromTokens.mts";

const message =
  "Type sizes and families come only from src/tokens/typography.ts, so every page shares one type scale. Apply a style from `type` instead of setting the property.";

ruleTester.run("type-from-tokens", typeFromTokens, {
  valid: [
    { code: 'export const body = { fontSize: "1rem" };', filename: "src/tokens/typography.ts" },
    {
      code: 'export const styles = { lineHeight: "inherit", letterSpacing: 0, fontFamily: font.mono };',
      filename: "src/components/lesson/CodeBlock.tsx",
    },
  ],
  invalid: [
    {
      code: 'export const styles = { fontSize: "14px" };',
      filename: "src/components/lesson/Callout.tsx",
      errors: [{ message }],
    },
    {
      code: 'export const styles = { "lineHeight": 1.4 };',
      filename: "src/ui/Badge.tsx",
      errors: [{ message }],
    },
    {
      code: 'export const styles = { fontFamily: "Georgia, serif" };',
      filename: "src/app/about/_parts/AboutSteps.tsx",
      errors: [{ message }],
    },
  ],
});
