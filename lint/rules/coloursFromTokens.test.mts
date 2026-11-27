import { coloursFromTokens } from "./coloursFromTokens.mts";
import { ruleTester } from "./ruleTester.fixture.mts";

const message =
  "Colours come only from src/tokens, so dark mode and the palette stay in one place. Use colors or shadows from @/tokens/tokens.stylex, or palette from @/tokens/palette where CSS variables can't be read.";

ruleTester.run("colours-from-tokens", coloursFromTokens, {
  valid: [
    { code: 'export const paper = "#f7f4ee";', filename: "src/tokens/palette.ts" },
    {
      code: "export const styles = { color: colors.ink, borderColor: colors.rule };",
      filename: "src/components/shell/Footer.tsx",
    },
    { code: 'export const href = "#section-2";', filename: "src/components/lesson/PageRail.tsx" },
  ],
  invalid: [
    {
      code: 'export const styles = { color: "#1a1a1a" };',
      filename: "src/components/shell/Footer.tsx",
      errors: [{ message }],
    },
    {
      code: 'export const shadow = "0 1px 2px rgba(0, 0, 0, 0.1)";',
      filename: "src/ui/Button.tsx",
      errors: [{ message }],
    },
    {
      code: 'export const accent = "oklch(62% 0.19 40)";',
      filename: "src/diagrams/useRoundTrip.ts",
      errors: [{ message }],
    },
  ],
});
