import { repoPath } from "./types.mts";
import type { Node, Rule } from "./types.mts";

type MemberExpression = Node & {
  object: Node & { name?: string };
  property: Node & { name?: string };
};

const storage = new Set(["localStorage", "sessionStorage"]);

function touchesStorage(node: MemberExpression) {
  const objectName = node.object.type === "Identifier" ? node.object.name : undefined;
  const propertyName = node.property.type === "Identifier" ? node.property.name : undefined;
  return (
    storage.has(objectName ?? "") || (objectName === "window" && storage.has(propertyName ?? ""))
  );
}

export const storageInHooks: Rule = {
  meta: {
    type: "problem",
    docs: { description: "Read and write browser storage only in src/hooks." },
  },
  create(context) {
    if (repoPath(context.filename).startsWith("src/hooks/")) {
      return {};
    }
    return {
      MemberExpression(node: MemberExpression) {
        if (touchesStorage(node)) {
          context.report({
            node,
            message:
              "Browser storage is read and written only in src/hooks, so each stored value has one writer and one format. Use or add a hook there (RFC 0002 part 5).",
          });
        }
      },
    };
  },
};
