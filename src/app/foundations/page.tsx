import * as stylex from "@stylexjs/stylex";
import type { Metadata } from "next";

import { colors, measure, space } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";

import { Colour } from "./_parts/Colour";
import { Layout } from "./_parts/Layout";
import { PageParts } from "./_parts/PageParts";
import { Primitives } from "./_parts/Primitives";
import { Typography } from "./_parts/Typography";

export const metadata: Metadata = { title: "Foundations · Patternbook" };

const styles = stylex.create({
  page: {
    padding: { default: space.s6, "@media (min-width: 768px)": space.s16 },
    gap: space.s16,
    marginInline: "auto",
    display: "flex",
    flexDirection: "column",
    maxWidth: 1440,
  },
  header: { gap: space.s3, display: "flex", flexDirection: "column" },
  eyebrow: { color: colors.inkMuted },
  title: { margin: 0 },
  lede: { margin: 0, color: colors.inkSoft, maxWidth: measure.prose },
});

export default function Foundations() {
  return (
    <main {...stylex.props(styles.page)}>
      <header {...stylex.props(styles.header)}>
        <div {...stylex.props(type.label, styles.eyebrow)}>Patternbook · Design system</div>
        <h1 {...stylex.props(type.display, styles.title)}>Foundations</h1>
        <p {...stylex.props(styles.lede)}>
          The Patternbook design system: the tokens, primitives and page parts every lesson and
          diagram is built from, shown in every state.
        </p>
      </header>
      <Colour />
      <Typography />
      <Layout />
      <Primitives />
      <PageParts />
    </main>
  );
}
