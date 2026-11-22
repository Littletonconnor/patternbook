import type { Node, Rule } from "./types.mts";

export const noEnum: Rule = {
  meta: {
    type: "problem",
    docs: { description: "Ban TypeScript enums." },
  },
  create(context) {
    return {
      TSEnumDeclaration(node: Node) {
        context.report({
          node,
          message:
            "Enums generate runtime code and can't be run by Node's type stripping. Use a union of string literals, or an `as const` object with a type derived from it.",
        });
      },
    };
  },
};
