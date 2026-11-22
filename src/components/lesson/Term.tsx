import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";

import { glossary } from "@/content/glossary";
import type { GlossaryId } from "@/content/glossary";
import { colors, motion, radius } from "@/tokens/tokens.stylex";
import { Tooltip } from "@/ui/Tooltip";

const HOVER = "@media (hover: hover)";

const styles = stylex.create({
  term: {
    font: "inherit",
    padding: 0,
    borderRadius: radius.mark,
    borderWidth: 0,
    backgroundColor: "transparent",
    color: "inherit",
    cursor: "help",
    outlineColor: colors.focus,
    outlineOffset: 2,
    outlineStyle: { default: "none", ":focus-visible": "solid" },
    outlineWidth: 2,
    textDecorationColor: {
      default: colors.inkMuted,
      ":focus-visible": colors.ink,
      ":hover": { [HOVER]: colors.ink, default: null },
    },
    textDecorationLine: "underline",
    textDecorationStyle: "dotted",
    textDecorationThickness: 1.5,
    textUnderlineOffset: 3,
    transitionDuration: motion.press,
    transitionProperty: "text-decoration-color",
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
