import { repoPath } from "./types.mts";
import type { Node, Rule } from "./types.mts";

type Named = Node & { name?: string };
type MemberExpression = Node & { object: Named & Partial<MemberExpression>; property: Named };

const wrapped: Record<string, string> = {
  localStorage: "useLocalStorage",
  sessionStorage: "a session storage hook",
  cookie: "useCookie",
  clipboard: "useCopyToClipboard",
};

const owners: Record<string, string> = {
  localStorage: "window",
  sessionStorage: "window",
  cookie: "document",
  clipboard: "navigator",
};

function nameOf(node: Named) {
  return node.type === "Identifier" ? node.name : undefined;
}

function browserApi(node: MemberExpression) {
  const object = nameOf(node.object);
  const property = nameOf(node.property);
  if (object !== undefined && (object === "localStorage" || object === "sessionStorage")) {
    return object;
  }
  if (property !== undefined && object !== undefined && owners[property] === object) {
    return property;
  }
  return undefined;
}

export const browserApisInHooks: Rule = {
  meta: {
    type: "problem",
    docs: { description: "Browser storage, cookies and the clipboard are used only in src/hooks." },
  },
  create(context) {
    const path = repoPath(context.filename);
    if (path.startsWith("src/hooks/") || path.startsWith("src/testing/")) {
      return {};
    }
    return {
      MemberExpression(node: MemberExpression) {
        const api = browserApi(node);
        if (api !== undefined) {
          context.report({
            node,
            message: `${api} is used only inside src/hooks, so each value has one typed reader and writer and failures are handled in one place. Use ${wrapped[api] ?? "a hook from src/hooks"}, or add a hook there.`,
          });
        }
      },
    };
  },
};
