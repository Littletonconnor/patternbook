import * as stylex from "@stylexjs/stylex";
import { space } from "@/tokens/tokens.stylex";
import { Section } from "./Section";
import { ButtonExample } from "./Button";

const styles = stylex.create({
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: space.s4,
  },
});

export function Primitives() {
  return (
    <Section
      eyebrow="04 · Primitives · src/ui"
      title="Controls: Base UI for behaviour, StyleX for the look"
      note="Hover, press and Tab to see the states. Disabled is the only one a page can show at rest."
    >
      <div {...stylex.props(styles.grid)}>
        <ButtonExample />
      </div>
    </Section>
  );
}
