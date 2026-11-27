import { dirname, join, normalize } from "node:path";

export const maxAgentsFileLines = 150;

export type TextFile = { path: string; text: string };

const codeSpan = /`([^`\n]+)`/g;
const placeholder = /NNNN|[<>*[\]#{}]|\s/;
const fileLike = /\/|\.[a-z]+$/i;

export function mentionedPaths(text: string) {
  return [...text.matchAll(codeSpan)]
    .map((match) => match[1] ?? "")
    .filter((span) => fileLike.test(span) && !placeholder.test(span) && !span.startsWith("@/"));
}

function resolves(file: string, mention: string, exists: (path: string) => boolean) {
  const candidates = [join(dirname(file), mention), normalize(mention)].map((path) =>
    path.replace(/\/$/, ""),
  );
  return candidates.some((candidate) => exists(candidate));
}

export function agentsFileProblems(files: readonly TextFile[], exists: (path: string) => boolean) {
  return files.flatMap(({ path, text }) => {
    const lines = text.trimEnd().split("\n").length;
    const tooLong =
      lines > maxAgentsFileLines
        ? [
            `${path}: ${lines} lines, over the limit of ${maxAgentsFileLines}. Every line is loaded on every task, so move detail that only some tasks need into a file the agent reads when it needs it.`,
          ]
        : [];
    const missing = mentionedPaths(text)
      .filter((mention) => !resolves(path, mention, exists))
      .map(
        (mention) =>
          `${path}: mentions \`${mention}\`, which does not exist next to this file or at the repository root. Update the path or remove the mention.`,
      );
    return [...tooLong, ...missing];
  });
}
