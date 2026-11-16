import { Button as BaseButton } from "@base-ui/react/button";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";
import { colors, motion, radius, space } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";

const HOVER = "@media (hover: hover)";

const PREVIEW_HOVER = ":is([data-preview=hover], [data-preview=pressed])";
const PREVIEW_PRESSED = ":is([data-preview=pressed])";
const PREVIEW_FOCUS = ":is([data-preview=focus])";

const styles = stylex.create({
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: space.s2,
    height: 36,
    paddingInline: 14,
    borderRadius: radius.control,
    borderWidth: 1,
    borderStyle: "solid",
    fontFamily: "inherit",
    whiteSpace: "nowrap",
    cursor: "pointer",
    transitionProperty: "background-color, transform",
    transitionDuration: motion.press,
    transitionTimingFunction: motion.easeOut,
    transform: { default: null, ":active": "scale(0.97)", [PREVIEW_PRESSED]: "scale(0.97)" },
    outlineStyle: { default: "none", ":focus-visible": "solid", [PREVIEW_FOCUS]: "solid" },
    outlineWidth: 2,
    outlineOffset: 2,
    outlineColor: colors.focus,
  },
  small: { height: 32, paddingInline: 10, gap: space.s1 },
  disabled: { opacity: 0.5, cursor: "not-allowed", transform: null },
});

const variants = stylex.create({
  primary: { backgroundColor: colors.ink, borderColor: colors.ink, color: colors.paper },
  secondary: { backgroundColor: colors.surface, borderColor: colors.lineStrong, color: colors.ink },
  ghost: { backgroundColor: "transparent", borderColor: "transparent", color: colors.inkSoft },
});

const hovers = stylex.create({
  primary: {
    backgroundColor: {
      default: colors.ink,
      ":hover": { default: null, [HOVER]: colors.inkSoft },
      [PREVIEW_HOVER]: colors.inkSoft,
    },
  },
  secondary: {
    backgroundColor: {
      default: colors.surface,
      ":hover": { default: null, [HOVER]: colors.sunken },
      [PREVIEW_HOVER]: colors.sunken,
    },
  },
  ghost: {
    backgroundColor: {
      default: "transparent",
      ":hover": { default: null, [HOVER]: colors.sunken },
      [PREVIEW_HOVER]: colors.sunken,
    },
  },
});

type ButtonProps = Omit<ComponentProps<typeof BaseButton>, "className" | "style"> & {
  variant?: keyof typeof variants;
  size?: "default" | "small";
};

export function Button({ variant = "secondary", size = "default", ...props }: ButtonProps) {
  return (
    <BaseButton
      {...props}
      {...stylex.props(
        type.control,
        styles.base,
        size === "small" && styles.small,
        variants[variant],
        props.disabled ? styles.disabled : hovers[variant],
      )}
    />
  );
}
