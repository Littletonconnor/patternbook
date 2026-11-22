import * as stylex from "@stylexjs/stylex";

import { colors, radius, space } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";

const steps = [
  {
    title: "Problem",
    body: "The situation and its symptoms, described before any solution is named.",
    tone: "muted",
  },
  {
    title: "Failure",
    body: "The naive approach running in the diagram until it breaks.",
    tone: "fault",
  },
  {
    title: "Fix",
    body: "The pattern applied in the same diagram, with a toggle to switch between the broken and fixed versions.",
    tone: "sound",
  },
  {
    title: "Trade-offs",
    body: "What the pattern adds in complexity or performance, when not to use it, and further reading.",
    tone: "muted",
  },
] as const;

const styles = stylex.create({
  steps: {
    margin: 0,
    padding: 0,
    gap: space.s4,
    listStyle: "none",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(220px, 100%), 1fr))",
  },
  card: {
    padding: 20,
    borderColor: colors.line,
    borderRadius: radius.frame,
    borderStyle: "solid",
    borderWidth: 1,
    gap: 10,
    backgroundColor: colors.surface,
    display: "flex",
    flexDirection: "column",
  },
  title: { fontWeight: 600 },
  soft: { color: colors.inkSoft },
});

const stepTones = stylex.create({
  muted: { color: colors.inkMuted },
  fault: { color: colors.faultInk },
  sound: { color: colors.soundInk },
});

export function AboutSteps() {
  return (
    <ol {...stylex.props(styles.steps)}>
      {steps.map((step, i) => (
        <li key={step.title} {...stylex.props(styles.card)}>
          <span {...stylex.props(type.number, stepTones[step.tone])}>
            {String(i + 1).padStart(2, "0")}
          </span>
          <span {...stylex.props(type.body, styles.title)}>{step.title}</span>
          <span {...stylex.props(type.small, styles.soft)}>{step.body}</span>
        </li>
      ))}
    </ol>
  );
}
