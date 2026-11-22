import { repoPath } from "./types.mts";
import type { Node, Rule } from "./types.mts";

type Literal = Node & { value: unknown };

const colourLiteral = /#[\da-f]{3,8}\b|\b(?:rgba?|hsla?|oklch|oklab|lab|lch)\(/i;

export const coloursFromTokens: Rule = {
  meta: {
    type: "problem",
    docs: { description: "Colours come only from src/tokens." },
  },
  create(context) {
    if (repoPath(context.filename).startsWith("src/tokens/")) {
      return {};
    }
    return {
      Literal(node: Literal) {
        if (typeof node.value === "string" && colourLiteral.test(node.value)) {
          context.report({
            node,
            message:
              "Colours come only from src/tokens, so dark mode and the palette stay in one place. Use colors or shadows from @/tokens/tokens.stylex, or palette from @/tokens/palette where CSS variables can't be read.",
          });
        }
      },
    };
  },
};
