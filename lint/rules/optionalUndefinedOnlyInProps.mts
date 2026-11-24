import type { Node, Rule } from "./types.mts";

type TypeNode = Node & { types?: TypeNode[] };
type PropertySignature = Node & {
  optional: boolean;
  typeAnnotation?: { typeAnnotation: TypeNode };
};
type TypeAlias = Node & { id: { name: string } };

function allowsUndefined(type: TypeNode): boolean {
  if (type.type === "TSUndefinedKeyword") {
    return true;
  }
  return type.type === "TSUnionType" && (type.types ?? []).some(allowsUndefined);
}

function isTypeAlias(node: Node): node is TypeAlias {
  return node.type === "TSTypeAliasDeclaration";
}

function enclosingAlias(node: Node) {
  for (let current = node.parent; current; current = current.parent) {
    if (isTypeAlias(current)) {
      return current.id.name;
    }
  }
  return undefined;
}

export const optionalUndefinedOnlyInProps: Rule = {
  meta: {
    type: "problem",
    docs: {
      description: "An optional property may also allow undefined only in a component props type.",
    },
  },
  create(context) {
    return {
      TSPropertySignature(node: PropertySignature) {
        const type = node.typeAnnotation?.typeAnnotation;
        if (!node.optional || type === undefined || !allowsUndefined(type)) {
          return;
        }
        if (enclosingAlias(node)?.endsWith("Props")) {
          return;
        }
        context.report({
          node,
          message:
            "`key?: T | undefined` lets callers set the key to undefined, and a spread such as `{ ...defaults, ...value }` then overwrites the default with undefined. Write `key?: T` and leave the key out when there is no value. Only component props, in a type named `<Name>Props`, may allow undefined, because props are read with defaults and truthiness checks that treat undefined as missing.",
        });
      },
    };
  },
};
