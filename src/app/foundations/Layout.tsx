import * as stylex from "@stylexjs/stylex";
import { colors, radius, space } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";
import { Card, Section, Token } from "./Section";

const styles = stylex.create({
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: space.s4,
  },
  spaceRow: { display: "flex", alignItems: "center", gap: space.s3 },
  spaceLabel: { width: 128, flexShrink: 0 },
  bar: { height: 12, borderRadius: 1, backgroundColor: colors.ink },
  width: (width: string) => ({ width }),
  shapes: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: space.s4 },
  shape: { display: "flex", flexDirection: "column", gap: space.s2 },
  box: {
    height: 72,
    backgroundColor: colors.sunken,
    borderWidth: 1.5,
    borderStyle: "solid",
    borderColor: colors.ink,
  },
  rounded: (borderRadius: string) => ({ borderRadius }),
  measureRow: { display: "flex", flexDirection: "column", gap: space.s1 },
  measureBar: { height: 12, borderRadius: 2 },
  fill: (color: string) => ({ backgroundColor: color }),
  note: { margin: 0, color: colors.inkSoft },
});

const spaces = [
  { token: "s1", px: 4 },
  { token: "s2", px: 8 },
  { token: "s3", px: 12 },
  { token: "s4", px: 16 },
  { token: "s6", px: 24 },
  { token: "s8", px: 32 },
  { token: "s12", px: 48 },
  { token: "s16", px: 64 },
  { token: "s24", px: 96 },
] as const;

const radii = [
  { token: "mark", px: 4, use: "rows, chips, keys" },
  { token: "control", px: 8, use: "buttons, inputs" },
  { token: "frame", px: 12, use: "diagrams, cards" },
] as const;

const measures = [
  { token: "sidebar", px: 240, share: "25%", color: colors.lineStrong },
  { token: "prose", px: 680, share: "71%", color: colors.ink },
  { token: "diagram", px: 960, share: "100%", color: colors.signal },
  { token: "rail", px: 200, share: "21%", color: colors.lineStrong },
] as const;

export function Layout() {
  return (
    <Section eyebrow="03 · Space, shape, measure" title="A 4 px grid, three radii, four widths">
      <div {...stylex.props(styles.grid)}>
        <Card title="Spacing">
          {spaces.map(({ token, px }) => (
            <div key={token} {...stylex.props(styles.spaceRow)}>
              <span {...stylex.props(styles.spaceLabel)}>
                <Token>
                  space.{token} · {px}
                </Token>
              </span>
              <div {...stylex.props(styles.bar, styles.width(space[token]))} />
            </div>
          ))}
        </Card>

        <Card title="Shape">
          <div {...stylex.props(styles.shapes)}>
            {radii.map(({ token, px, use }) => (
              <div key={token} {...stylex.props(styles.shape)}>
                <div {...stylex.props(styles.box, styles.rounded(radius[token]))} />
                <Token>
                  radius.{token} · {px}
                </Token>
                <Token>{use}</Token>
              </div>
            ))}
          </div>
          <p {...stylex.props(type.small, styles.note)}>
            Borders are 1 px Line. Marks inside diagrams use a 1.5 px Ink stroke. No shadows on the
            page; one soft shadow is reserved for things that float.
          </p>
        </Card>

        <Card title="Measure">
          {measures.map(({ token, px, share, color }) => (
            <div key={token} {...stylex.props(styles.measureRow)}>
              <div {...stylex.props(styles.measureBar, styles.width(share), styles.fill(color))} />
              <Token>
                measure.{token} · {px}
              </Token>
            </div>
          ))}
          <p {...stylex.props(type.small, styles.note)}>
            Diagrams are wider than the text on purpose. The break in the column edge tells the
            reader it is time to play.
          </p>
        </Card>
      </div>
    </Section>
  );
}
