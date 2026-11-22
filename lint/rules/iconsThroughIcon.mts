import { repoPath } from "./types.mts";
import type { Node, Rule } from "./types.mts";

type ImportDeclaration = Node & {
  source: { value: string };
  importKind?: string;
  specifiers: (Node & { local: { name: string }; importKind?: string })[];
};

type JSXOpeningElement = Node & { name: Node & { name?: string } };

export const iconsThroughIcon: Rule = {
  meta: {
    type: "problem",
    docs: { description: "Render Lucide icons only through the Icon wrapper." },
  },
  create(context) {
    if (repoPath(context.filename) === "src/ui/Icon.tsx") {
      return {};
    }
    const icons = new Set<string>();
    return {
      ImportDeclaration(node: ImportDeclaration) {
        if (node.source.value !== "lucide-react" || node.importKind === "type") {
          return;
        }
        for (const specifier of node.specifiers) {
          if (specifier.importKind !== "type") {
            icons.add(specifier.local.name);
          }
        }
      },
      JSXOpeningElement(node: JSXOpeningElement) {
        const name = node.name.name;
        if (name !== undefined && icons.has(name)) {
          context.report({
            node,
            message: `Render ${name} through <Icon icon={${name}} /> from @/ui/Icon, so stroke width and size come from one place (RFC 0002 part 5).`,
          });
        }
      },
    };
  },
};
