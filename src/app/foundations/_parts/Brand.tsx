import * as stylex from "@stylexjs/stylex";

import { Brand as TopBarBrand } from "@/components/shell/Brand";
import { BrandMark } from "@/components/shell/BrandMark";
import { colors, radius, space } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";

import { Card, Section, Specs } from "./Section";

const styles = stylex.create({
  grid: {
    gap: space.s4,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  },
  stage: {
    padding: space.s8,
    borderRadius: radius.control,
    gap: space.s6,
    alignItems: "flex-end",
    backgroundColor: colors.paper,
    display: "flex",
    justifyContent: "center",
    minHeight: 160,
  },
  size: { gap: space.s2, alignItems: "center", display: "flex", flexDirection: "column" },
  muted: { color: colors.inkMuted },
});

const sizes = [16, 24, 32, 48];

export function Brand() {
  return (
    <Section
      eyebrow="05 · Brand"
      title="A grid of dots with one out of place"
      note="The mark is the pattern and the one thing in it that is moving, which is what every diagram shows. It uses only ink and signal, so dark mode comes from the colour tokens."
    >
      <div {...stylex.props(styles.grid)}>
        <Card title="Mark">
          <div {...stylex.props(styles.stage)}>
            <BrandMark size={112} />
          </div>
          <Specs
            rows={[
              ["Dots", "Eight ink dots, r 2.4, at 7, 16 and 25 on a 32 grid"],
              ["Signal", "r 4.25 at (26.5, 26.5), off the grid in the empty slot"],
            ]}
          />
        </Card>
        <Card title="Sizes">
          <div {...stylex.props(styles.stage)}>
            {sizes.map((size) => (
              <div key={size} {...stylex.props(styles.size)}>
                <BrandMark size={size} />
                <span {...stylex.props(type.number, styles.muted)}>{size}</span>
              </div>
            ))}
          </div>
          <Specs
            rows={[
              ["Favicon", "src/app/icon.svg, favicon.ico"],
              ["App icons", "apple-icon.png, public/icons"],
            ]}
          />
        </Card>
        <Card title="Lockup">
          <div {...stylex.props(styles.stage)}>
            <TopBarBrand />
          </div>
          <Specs
            rows={[
              ["Wordmark", "patternbook, lowercase, type.wordmark"],
              ["Mark", "19 px, 6 px gap"],
            ]}
          />
        </Card>
      </div>
    </Section>
  );
}
