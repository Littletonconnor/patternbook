import type { Rule } from "./types.mts";

export const noComments: Rule = {
  meta: {
    type: "problem",
    docs: { description: "Ban comments, including disable directives." },
  },
  create(context) {
    return {
      Program() {
        for (const comment of context.sourceCode.getAllComments()) {
          context.report({
            loc: comment.loc,
            message:
              "Comments drift from the code they describe, and disable comments switch checks off. Say it in a name instead: extract a function or constant named after the reason. Fix the rule violation instead of disabling it.",
          });
        }
      },
    };
  },
};
