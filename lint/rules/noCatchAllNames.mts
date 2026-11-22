import { repoPath } from "./types.mts";
import type { Node, Rule } from "./types.mts";

const banned = new Set(["utils", "util", "helpers", "helper", "common", "misc", "shared"]);

function catchAllSegment(path: string) {
  return path
    .split("/")
    .map((segment) => segment.replace(/\.[^.]+$/, ""))
    .find((segment) => banned.has(segment));
}

export const noCatchAllNames: Rule = {
  meta: {
    type: "problem",
    docs: { description: "Ban catch-all file and folder names such as utils and helpers." },
  },
  create(context) {
    return {
      Program(node: Node) {
        const segment = catchAllSegment(repoPath(context.filename));
        if (segment !== undefined) {
          context.report({
            node,
            message: `"${segment}" says nothing about what the module does. Name the file after what it exports and put it in the layer it belongs to (RFC 0002 part 4).`,
          });
        }
      },
    };
  },
};
