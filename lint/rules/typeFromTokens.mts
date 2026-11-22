import { repoPath } from "./types.mts";
import type { Node, Rule } from "./types.mts";

type Property = Node & {
  key: Node & { name?: string; value?: unknown };
  value: Node & { value?: unknown };
};

const typeProperties = new Set(["fontSize", "fontFamily", "lineHeight", "letterSpacing"]);
const keywords = new Set(["inherit", "normal", "0"]);

function keyName(property: Property) {
  return property.key.name ?? (typeof property.key.value === "string" ? property.key.value : "");
}

function isRawValue(value: Property["value"]) {
  return value.type === "Literal" && !keywords.has(String(value.value));
}

export const typeFromTokens: Rule = {
  meta: {
    type: "problem",
    docs: {
      description: "Font size, family, line height and letter spacing come only from src/tokens.",
    },
  },
  create(context) {
    if (repoPath(context.filename).startsWith("src/tokens/")) {
      return {};
    }
    return {
      Property(node: Property) {
        if (typeProperties.has(keyName(node)) && isRawValue(node.value)) {
          context.report({
            node,
            message:
              "Type sizes and families come only from src/tokens/typography.ts, so every page shares one type scale. Apply a style from `type` instead of setting the property.",
          });
        }
      },
    };
  },
};
