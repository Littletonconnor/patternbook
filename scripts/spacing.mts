import ts from "typescript";

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

export function countRawSpacing(file: string, text: string) {
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest);
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

export type Counts = Record<string, number>;

export function compareSpacing(counts: Counts, baseline: Counts) {
  const grown = Object.entries(counts).filter(([file, count]) => count > (baseline[file] ?? 0));
  const problems = grown.map(
    ([file, count]) =>
      `${file}: ${count} raw spacing values, up from ${baseline[file] ?? 0}. Use space from @/tokens/tokens.stylex for padding, margin, gap and inset.`,
  );
  const lowered = grown.length === 0 && JSON.stringify(counts) !== JSON.stringify(baseline);
  return { problems, lowered };
}
