import type { Node, Rule } from "./types.mts";

type Program = Node & { body: Node[] };

const reExports = new Set(["ExportAllDeclaration", "ExportNamedDeclaration"]);

function isReExport(statement: Node) {
  return reExports.has(statement.type) && "source" in statement && statement.source !== null;
}

export const noBarrelFiles: Rule = {
  meta: {
    type: "problem",
    docs: { description: "Ban index files and files that only re-export other modules." },
  },
  create(context) {
    return {
      Program(node: Program) {
        const isIndex = /\/index\.(ts|tsx|mts)$/.test(context.filename);
        const onlyReExports = node.body.length > 0 && node.body.every(isReExport);
        if (isIndex || onlyReExports) {
          context.report({
            node,
            message:
              "Barrel files hide where code lives and slow builds. Import from the file that defines the export instead (RFC 0002 part 4).",
          });
        }
      },
    };
  },
};
