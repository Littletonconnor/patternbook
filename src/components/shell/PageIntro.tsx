import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";

import { colors, measure, space } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";

const styles = stylex.create({
  header: { gap: space.s4, display: "flex", flexDirection: "column", maxWidth: measure.prose },
  eyebrow: { color: colors.inkMuted },
  title: { margin: 0, textWrap: "balance" },
  lede: { margin: 0, color: colors.inkSoft, textWrap: "pretty" },
});

type PageIntroProps = {
  eyebrow: ReactNode;
  title: string;
  children: ReactNode;
  size?: "display" | "hero";
};

export function PageIntro({ eyebrow, title, children, size = "display" }: PageIntroProps) {
  return (
    <header {...stylex.props(styles.header)}>
      <div {...stylex.props(type.label, styles.eyebrow)}>{eyebrow}</div>
      <h1 {...stylex.props(size === "hero" ? type.hero : type.display, styles.title)}>{title}</h1>
      <p {...stylex.props(type.lede, styles.lede)}>{children}</p>
    </header>
  );
}
