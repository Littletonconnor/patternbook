import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";
import { colors, space } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";

const styles = stylex.create({
  head: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: `${space.s1} ${space.s4}`,
  },
  title: { margin: 0 },
  meta: { color: colors.inkMuted },
});

export function SectionHead({ title, meta }: { title: string; meta?: ReactNode }) {
  return (
    <div {...stylex.props(styles.head)}>
      <h2 {...stylex.props(type.heading, styles.title)}>{title}</h2>
      {meta && <span {...stylex.props(type.number, styles.meta)}>{meta}</span>}
    </div>
  );
}
