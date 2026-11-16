import type { Metadata } from "next";
import * as stylex from "@stylexjs/stylex";
import { colors, measure, space } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";
import { Colour } from "./Colour";
import { Layout } from "./Layout";
import { Typography } from "./Typography";
import { Primitives } from "./Primitives";

export const metadata: Metadata = { title: "Foundations · Patternbook" };

const styles = stylex.create({
  page: {
    display: "flex",
    flexDirection: "column",
    gap: space.s16,
    maxWidth: 1440,
    marginInline: "auto",
    padding: { default: space.s6, "@media (min-width: 768px)": space.s16 },
  },
  header: { display: "flex", flexDirection: "column", gap: space.s3 },
  eyebrow: { color: colors.inkMuted },
  title: { margin: 0 },
  lede: { margin: 0, maxWidth: measure.prose, color: colors.inkSoft },
});

export default function Foundations() {
  return (
    <main {...stylex.props(styles.page)}>
      <header {...stylex.props(styles.header)}>
        <div {...stylex.props(type.label, styles.eyebrow)}>Patternbook · Design system</div>
        <h1 {...stylex.props(type.display, styles.title)}>Foundations</h1>
        <p {...stylex.props(styles.lede)}>
          A quiet page so the figures can be loud. Neutrals carry the reading; colour is reserved
          for meaning inside a figure.
        </p>
      </header>
      <Colour />
      <Typography />
      <Layout />
      <Primitives />
    </main>
  );
}
