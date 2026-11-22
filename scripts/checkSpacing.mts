import { readFileSync, writeFileSync } from "node:fs";

import ts from "typescript";

import { moduleFile, walk } from "./moduleGraph.mts";

const baselinePath = "scripts/spacingBaseline.json";
const spacingKey = /^(padding|margin|inset)|^(gap|rowGap|columnGap)$/;
const rawLength = /(?<![\w.$])-?\d*\.?\d+(px|rem|em)\b/g;

function rawInText(text: string) {
  return text.match(rawLength)?.length ?? 0;
}

function rawInTemplate(node: ts.TemplateExpression) {
  const texts = [node.head.text, ...node.templateSpans.map((span) => span.literal.text)];
  return texts.reduce((sum, text) => sum + rawInText(text), 0);
}

function rawIn(node: ts.Node): number {
  if (ts.isNumericLiteral(node)) {
    return node.text === "0" ? 0 : 1;
  }
  if (ts.isPrefixUnaryExpression(node)) {
    return rawIn(node.operand);
  }
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    return rawInText(node.text);
  }
  if (ts.isTemplateExpression(node)) {
    return rawInTemplate(node);
  }
  if (ts.isObjectLiteralExpression(node)) {
    return node.properties.reduce(
      (sum, property) =>
        sum + (ts.isPropertyAssignment(property) ? rawIn(property.initializer) : 0),
      0,
    );
  }
  return 0;
}

function propertyName(node: ts.PropertyAssignment) {
  return ts.isIdentifier(node.name) || ts.isStringLiteral(node.name) ? node.name.text : "";
}

export function countRawSpacing(file: string) {
  const source = ts.createSourceFile(file, readFileSync(file, "utf8"), ts.ScriptTarget.Latest);
  let count = 0;
  const visit = (node: ts.Node) => {
    if (ts.isPropertyAssignment(node) && spacingKey.test(propertyName(node))) {
      count += rawIn(node.initializer);
      return;
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  return count;
}

function currentCounts() {
  const files = walk("src").filter(
    (file) => moduleFile.test(file) && !file.startsWith("src/tokens/"),
  );
  const counts: Record<string, number> = {};
  for (const file of files.toSorted()) {
    const count = countRawSpacing(file);
    if (count > 0) {
      counts[file] = count;
    }
  }
  return counts;
}

function readBaseline(): Record<string, number> {
  const parsed: unknown = JSON.parse(readFileSync(baselinePath, "utf8"));
  if (typeof parsed !== "object" || parsed === null) {
    return {};
  }
  return Object.fromEntries(
    Object.entries(parsed).filter(
      (entry): entry is [string, number] => typeof entry[1] === "number",
    ),
  );
}

function writeBaseline(counts: Record<string, number>) {
  writeFileSync(baselinePath, `${JSON.stringify(counts, null, 2)}\n`);
}

function check() {
  const counts = currentCounts();
  if (process.argv.includes("--init")) {
    writeBaseline(counts);
    return [];
  }
  const baseline = readBaseline();
  const grown = Object.entries(counts).filter(([file, count]) => count > (baseline[file] ?? 0));
  if (grown.length === 0 && JSON.stringify(counts) !== JSON.stringify(baseline)) {
    writeBaseline(counts);
    process.stdout.write(`Raw spacing went down. Lowered ${baselinePath}; commit it.\n`);
  }
  return grown.map(
    ([file, count]) =>
      `${file}: ${count} raw spacing values, up from ${baseline[file] ?? 0}. Use space from @/tokens/tokens.stylex for padding, margin, gap and inset.`,
  );
}

const problems = check();
for (const problem of problems) {
  process.stderr.write(`${problem}\n`);
}
process.exitCode = problems.length > 0 ? 1 : 0;
