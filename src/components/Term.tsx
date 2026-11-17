import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";
import { glossary, type GlossaryId } from "@/content/glossary";
import { colors, motion, radius } from "@/tokens/tokens.stylex";
import { Tooltip } from "@/ui/Tooltip";

const HOVER = "@media (hover: hover)";

const styles = stylex.create({
  term: {
    padding: 0,
    borderWidth: 0,
    backgroundColor: "transparent",
    color: "inherit",
    font: "inherit",
    cursor: "help",
    textDecorationLine: "underline",
    textDecorationStyle: "dotted",
    textDecorationThickness: 1.5,
    textUnderlineOffset: 3,
    textDecorationColor: {
      default: colors.inkMuted,
      ":hover": { default: null, [HOVER]: colors.ink },
      ":focus-visible": colors.ink,
    },
    transitionProperty: "text-decoration-color",
    transitionDuration: motion.press,
    borderRadius: radius.mark,
    outlineStyle: { default: "none", ":focus-visible": "solid" },
    outlineWidth: 2,
    outlineOffset: 2,
    outlineColor: colors.focus,
  },
});

export function Term({ id, children }: { id: GlossaryId; children: ReactNode }) {
  const entry = glossary[id];
  return (
    <Tooltip label={entry.term} description={entry.definition}>
      <button type="button" {...stylex.props(styles.term)}>
        {children}
      </button>
    </Tooltip>
  );
}
