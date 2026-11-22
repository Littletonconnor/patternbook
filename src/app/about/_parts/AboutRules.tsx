import * as stylex from "@stylexjs/stylex";
import { colors, radius, space } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";

const rules = [
  {
    title: "Failure before fix",
    body: "Each lesson shows the problem happening before it introduces the solution.",
  },
  {
    title: "One idea per diagram",
    body: "A diagram that needs more than a short caption is split into two.",
  },
  {
    title: "Terms are defined",
    body: "Every technical term has a short definition, shown on hover.",
  },
  {
    title: "No account",
    body: "Read progress is stored in localStorage in your browser.",
  },
];

const styles = stylex.create({
  rules: {
    margin: 0,
    padding: 0,
    borderColor: colors.line,
    borderRadius: radius.frame,
    borderStyle: "solid",
    borderWidth: 1,
    listStyle: "none",
    overflow: "hidden",
    backgroundColor: colors.surface,
  },
  rule: {
    gap: `${space.s1} ${space.s6}`,
    paddingBlock: space.s4,
    paddingInline: 20,
    display: "flex",
    flexWrap: "wrap",
    borderTopColor: colors.line,
    borderTopStyle: "solid",
    borderTopWidth: { default: 1, ":first-child": 0 },
  },
  ruleTitle: { flexBasis: "240px", flexGrow: "0", flexShrink: "0", fontWeight: 500 },
  ruleBody: { color: colors.inkSoft, flexBasis: "320px", flexGrow: "999", flexShrink: "1" },
});

export function AboutRules() {
  return (
    <ol {...stylex.props(styles.rules)}>
      {rules.map((rule) => (
        <li key={rule.title} {...stylex.props(styles.rule)}>
          <span {...stylex.props(type.body, styles.ruleTitle)}>{rule.title}</span>
          <span {...stylex.props(type.small, styles.ruleBody)}>{rule.body}</span>
        </li>
      ))}
    </ol>
  );
}
