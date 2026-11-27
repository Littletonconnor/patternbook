import { relative } from "node:path";

export type Node = { type: string; range: [number, number]; parent?: Node };

type Location = { start: { line: number; column: number }; end: { line: number; column: number } };

export type Comment = { type: string; value: string; loc: Location };

export type Report = ({ node: Node } | { loc: Location }) & { message: string };

export type Context = {
  filename: string;
  report: (report: Report) => void;
  sourceCode: { getAllComments: () => Comment[] };
};

export type Visitors = Partial<Record<string, (node: never) => void>>;

export type Rule = {
  meta: { type: "problem" | "suggestion"; docs: { description: string } };
  create: (context: Context) => Visitors;
};

export function repoPath(filename: string) {
  return relative(process.cwd(), filename);
}
