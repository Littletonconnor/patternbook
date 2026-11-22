import type { Node, Rule } from "./types.mts";

type Named = Node & { name?: string };
type Walk = { type: string; id?: { name?: string } | null; parent?: Walk };
type Call = Node & { callee: Named & { object?: Named; property?: Named } };

const sideEffects = new Set([
  "useEffect",
  "useLayoutEffect",
  "setTimeout",
  "setInterval",
  "requestAnimationFrame",
]);

function calledName(call: Call) {
  const { callee } = call;
  return callee.type === "MemberExpression" ? callee.property?.name : callee.name;
}

const namedScopes = new Set(["FunctionDeclaration", "VariableDeclarator"]);

function insideHook(node: Walk) {
  for (let current = node.parent; current; current = current.parent) {
    if (namedScopes.has(current.type) && current.id?.name?.startsWith("use")) {
      return true;
    }
  }
  return false;
}

export const effectsInHooks: Rule = {
  meta: {
    type: "problem",
    docs: { description: "Effects and timers run only inside custom hooks." },
  },
  create(context) {
    return {
      CallExpression(node: Call) {
        const name = calledName(node);
        if (name !== undefined && sideEffects.has(name) && !insideHook(node)) {
          context.report({
            node,
            message: `${name} runs only inside a custom hook, so components stay free of effects and each one has a name. Move it into a use* function, in this file if only this component needs it, or in src/hooks or src/diagrams if it is shared.`,
          });
        }
      },
    };
  },
};
