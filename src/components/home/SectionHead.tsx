import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";
import { colors, space } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";

const styles = stylex.create({
  root: { gap: space.s2, display: "flex", flexDirection: "column" },
  head: {
    gap: `${space.s1} ${space.s4}`,
    alignItems: "baseline",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  title: { margin: 0, textWrap: "balance" },
  meta: { color: colors.inkMuted },
  description: { margin: 0, color: colors.inkSoft, textWrap: "pretty", maxWidth: 680 },
});

export function SectionHead({
  title,
  meta,
  description,
}: {
  title: string;
  meta?: ReactNode;
  description?: ReactNode;
}) {
  return (
    <div {...stylex.props(styles.root)}>
      <div {...stylex.props(styles.head)}>
        <h2 {...stylex.props(type.heading, styles.title)}>{title}</h2>
        {meta && <span {...stylex.props(type.number, styles.meta)}>{meta}</span>}
      </div>
      {description && <p {...stylex.props(type.small, styles.description)}>{description}</p>}
    </div>
  );
}
