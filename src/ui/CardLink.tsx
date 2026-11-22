import * as stylex from "@stylexjs/stylex";
import NextLink from "next/link";
import type { ComponentProps } from "react";

import { colors, motion, radius, space } from "@/tokens/tokens.stylex";

const HOVER = "@media (hover: hover)";
const PREVIEW_HOVER = ":is([data-preview=hover])";
const PREVIEW_FOCUS = ":is([data-preview=focus])";

const styles = stylex.create({
  card: {
    borderColor: {
      [PREVIEW_HOVER]: colors.lineStrong,
      default: colors.line,
      ":hover": { [HOVER]: colors.lineStrong, default: null },
    },
    borderRadius: radius.frame,
    borderStyle: "solid",
    borderWidth: 1,
    overflow: "hidden",
    backgroundColor: colors.surface,
    color: colors.ink,
    display: "flex",
    flexDirection: "column",
    outlineColor: colors.focus,
    outlineOffset: 2,
    outlineStyle: { [PREVIEW_FOCUS]: "solid", default: "none", ":focus-visible": "solid" },
    outlineWidth: 2,
    textDecorationLine: "none",
    transitionDuration: motion.press,
    transitionProperty: "border-color",
    transitionTimingFunction: motion.easeOut,
  },
  padded: { padding: space.s4 },
});

type CardLinkProps = Omit<ComponentProps<typeof NextLink>, "className" | "style"> & {
  padding?: "default" | "none";
};

export function CardLink({ padding = "default", ...props }: CardLinkProps) {
  return (
    <NextLink
      {...props}
      {...stylex.props(styles.card, padding === "default" && styles.padded, stylex.defaultMarker())}
    />
  );
}
