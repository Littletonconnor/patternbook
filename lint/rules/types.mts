import { relative } from "node:path";

export type Node = { type: string };

export type Report = { node: Node; message: string };

export type Context = {
  filename: string;
  report: (report: Report) => void;
};

export type Visitors = Partial<Record<string, (node: never) => void>>;

export type Rule = {
  meta: { type: "problem" | "suggestion"; docs: { description: string } };
  create: (context: Context) => Visitors;
};

export function repoPath(filename: string) {
  return relative(process.cwd(), filename);
}
