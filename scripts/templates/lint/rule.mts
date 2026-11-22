import { repoPath } from "../../../lint/rules/types.mts";
import type { Node, Rule } from "../../../lint/rules/types.mts";

export const ruleName: Rule = {
  meta: {
    type: "problem",
    docs: { description: "What the rule bans, in one sentence." },
  },
  create(context) {
    return {
      Program(node: Node) {
        if (repoPath(context.filename) === "") {
          context.report({
            node,
            message: "What is wrong. What to write instead (RFC NNNN part N).",
          });
        }
      },
    };
  },
};
