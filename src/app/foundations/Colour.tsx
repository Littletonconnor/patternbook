import * as stylex from "@stylexjs/stylex";
import { colors, radius, space } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";
import { Card, Section, Token } from "./Section";

const HATCH = `repeating-linear-gradient(135deg, ${colors.faultWash} 0 6px, color-mix(in srgb, ${colors.fault} 25%, ${colors.faultWash}) 6px 8px)`;

const styles = stylex.create({
  neutrals: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
    gap: space.s4,
  },
  swatch: { display: "flex", flexDirection: "column", gap: space.s2 },
  chip: {
    height: 96,
    borderRadius: radius.control,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors.line,
  },
  fill: (color: string) => ({ backgroundColor: color }),
  name: { fontWeight: 500 },
  meanings: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: space.s4,
  },
  trio: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    height: 72,
    borderRadius: radius.control,
    overflow: "hidden",
  },
  hatch: { backgroundImage: HATCH },
  rule: { margin: 0, color: colors.inkSoft },
  tokens: { display: "flex", flexDirection: "column" },
});

const neutrals = [
  { label: "Paper", token: "paper" },
  { label: "Surface", token: "surface" },
  { label: "Sunken", token: "sunken" },
  { label: "Line", token: "line" },
  { label: "Line strong", token: "lineStrong" },
  { label: "Ink muted", token: "inkMuted" },
  { label: "Ink soft", token: "inkSoft" },
  { label: "Ink", token: "ink" },
] as const;

const meanings = [
  {
    label: "Signal",
    token: "signal",
    rule: "The thing that moves: a request in flight, a row arriving, the step happening right now.",
  },
  {
    label: "Focus",
    token: "focus",
    rule: "What is selected or in view: the current page window, a cursor position, a highlighted path.",
  },
  {
    label: "Fault",
    token: "fault",
    rule: "The bug on show: a duplicate, a skipped row, a lost update. Its wash is always hatched, so it never relies on hue alone.",
  },
  {
    label: "Sound",
    token: "sound",
    rule: "The correct outcome: every row seen once, the write that landed, the fix doing its job.",
  },
] as const;

function Swatch({ label, token }: (typeof neutrals)[number]) {
  return (
    <div {...stylex.props(styles.swatch)}>
      <div {...stylex.props(styles.chip, styles.fill(colors[token]))} />
      <div>
        <div {...stylex.props(type.small, styles.name)}>{label}</div>
        <Token>colors.{token}</Token>
      </div>
    </div>
  );
}

function MeaningCard({ label, token, rule }: (typeof meanings)[number]) {
  return (
    <Card title={label}>
      <div {...stylex.props(styles.trio)}>
        <div {...stylex.props(styles.fill(colors[token]))} />
        <div
          {...stylex.props(token === "fault" ? styles.hatch : styles.fill(colors[`${token}Wash`]))}
        />
        <div {...stylex.props(styles.fill(colors[`${token}Ink`]))} />
      </div>
      <p {...stylex.props(type.small, styles.rule)}>{rule}</p>
      <div {...stylex.props(styles.tokens)}>
        <Token>colors.{token}</Token>
        <Token>colors.{token}Wash</Token>
        <Token>colors.{token}Ink</Token>
      </div>
    </Card>
  );
}

export function Colour() {
  return (
    <>
      <Section eyebrow="01 · Colour" title="Neutrals">
        <div {...stylex.props(styles.neutrals)}>
          {neutrals.map((n) => (
            <Swatch key={n.token} {...n} />
          ))}
        </div>
      </Section>
      <Section
        eyebrow="01 · Colour"
        title="Meaning"
        note="Four colours, each with one job, used only inside diagrams and never as decoration. Each has a solid for marks, a wash for areas, and a darker ink that is safe for small text."
      >
        <div {...stylex.props(styles.meanings)}>
          {meanings.map((m) => (
            <MeaningCard key={m.token} {...m} />
          ))}
        </div>
      </Section>
    </>
  );
}
