import * as stylex from "@stylexjs/stylex";
import { codeToTokens } from "shiki";
import type { BundledLanguage, ThemedToken } from "shiki";
import { colors, space } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";
import { CodeTabs } from "./CodeTabs";

const syntax = stylex.create({
  keyword: { color: colors.focusInk },
  literal: { color: colors.signalInk },
  comment: { color: colors.inkMuted },
  plain: { color: colors.ink },
});

const styles = stylex.create({
  pre: { margin: 0, paddingBlock: space.s3, overflowX: "auto" },
  code: { display: "block", minWidth: "max-content" },
  line: { paddingInline: space.s3, display: "block", minHeight: "1lh" },
  held: { backgroundColor: colors.focusWash, boxShadow: `inset 3px 0 0 ${colors.focus}` },
});

function kindOf(token: ThemedToken): keyof typeof syntax {
  const scopes = (token.explanation ?? []).flatMap((part) => part.scopes.map((s) => s.scopeName));
  if (scopes.some((s) => s.startsWith("comment"))) {
    return "comment";
  }
  if (scopes.some((s) => s.startsWith("string") || s.startsWith("constant"))) {
    return "literal";
  }
  if (
    scopes.some(
      (s) =>
        (s.startsWith("keyword") && !s.startsWith("keyword.operator")) || s.startsWith("storage"),
    )
  ) {
    return "keyword";
  }
  return "plain";
}

export type CodeSample = {
  label: string;
  lang: BundledLanguage;
  code: string;
  highlight?: number;
};

async function Highlighted({ sample }: { sample: CodeSample }) {
  "use cache";
  const { tokens } = await codeToTokens(sample.code.trimEnd(), {
    lang: sample.lang,
    theme: "github-light",
    includeExplanation: "scopeName",
  });
  return (
    <pre {...stylex.props(type.codeSmall, styles.pre)}>
      <code {...stylex.props(styles.code)}>
        {tokens.map((line, i) => (
          <span key={i} {...stylex.props(styles.line, sample.highlight === i + 1 && styles.held)}>
            {line.map((token, j) => (
              <span key={j} {...stylex.props(syntax[kindOf(token)])}>
                {token.content}
              </span>
            ))}
          </span>
        ))}
      </code>
    </pre>
  );
}

export function CodeBlock({ samples }: { samples: readonly CodeSample[] }) {
  return (
    <CodeTabs
      tabs={samples.map((sample) => ({
        label: sample.label,
        code: sample.code.trimEnd(),
        body: <Highlighted sample={sample} />,
      }))}
    />
  );
}
