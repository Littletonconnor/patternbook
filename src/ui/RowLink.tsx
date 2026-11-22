import NextLink from "next/link";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";
import { colors, motion, radius, space } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";

const HOVER = "@media (hover: hover)";
const PREVIEW_HOVER = ":is([data-preview=hover])";
const PREVIEW_FOCUS = ":is([data-preview=focus])";

const styles = stylex.create({
  row: {
    backgroundColor: {
      [PREVIEW_HOVER]: colors.sunken,
      default: "transparent",
      ":hover": { [HOVER]: colors.sunken, default: null },
    },
    color: colors.ink,
    display: "flex",
    outlineColor: colors.focus,
    outlineOffset: -2,
    outlineStyle: { [PREVIEW_FOCUS]: "solid", default: "none", ":focus-visible": "solid" },
    outlineWidth: 2,
    textDecorationLine: "none",
    transitionDuration: motion.press,
    transitionProperty: "background-color, color",
    transitionTimingFunction: motion.easeOut,
  },
  default: {
    borderRadius: radius.control,
    gap: space.s4,
    paddingBlock: space.s3,
    paddingInline: space.s4,
    alignItems: "baseline",
  },
  compact: {
    borderRadius: 6,
    gap: 10,
    paddingInline: 10,
    alignItems: "center",
    color: {
      [PREVIEW_HOVER]: colors.ink,
      default: colors.inkSoft,
      ":hover": { [HOVER]: colors.ink, default: null },
    },
    height: 30,
  },
  current: {
    backgroundColor: { default: colors.line, ":hover": colors.line },
    color: { default: colors.ink, ":hover": colors.ink },
    fontWeight: 500,
  },
});

type RowLinkProps = Omit<ComponentProps<typeof NextLink>, "className" | "style"> & {
  size?: "default" | "compact";
  current?: boolean;
};

export function RowLink({ size = "default", current = false, ...props }: RowLinkProps) {
  return (
    <NextLink
      aria-current={current ? "page" : undefined}
      {...props}
      {...stylex.props(
        size === "compact" && type.ui,
        styles.row,
        styles[size],
        current && styles.current,
        stylex.defaultMarker(),
      )}
    />
  );
}
