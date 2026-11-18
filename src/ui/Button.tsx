import { Button as BaseButton } from "@base-ui/react/button";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";
import { colors, motion, radius, space } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";

const HOVER = "@media (hover: hover)";

export const BUTTON_PREVIEW_HOVER = ":is([data-preview=hover], [data-preview=pressed])";
export const BUTTON_PREVIEW_PRESSED = ":is([data-preview=pressed])";
export const BUTTON_PREVIEW_FOCUS = ":is([data-preview=focus])";

export const buttonStyles = stylex.create({
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
    whiteSpace: "nowrap",
    cursor: "pointer",
    transitionProperty: "background-color, transform",
    transitionDuration: motion.press,
    transitionTimingFunction: motion.easeOut,
    transform: { default: null, ":active": "scale(0.97)", [BUTTON_PREVIEW_PRESSED]: "scale(0.97)" },
    outlineStyle: { default: "none", ":focus-visible": "solid", [BUTTON_PREVIEW_FOCUS]: "solid" },
    outlineWidth: 2,
    outlineOffset: 2,
    outlineColor: colors.focus,
  },
  small: { height: 32, paddingInline: 10, gap: space.s1 },
  large: { height: 44, paddingInline: 18 },
  disabled: { opacity: 0.5, cursor: "not-allowed", transform: null },
});

export const buttonVariants = stylex.create({
  primary: { backgroundColor: colors.ink, borderColor: colors.ink, color: colors.paper },
  secondary: { backgroundColor: colors.surface, borderColor: colors.lineStrong, color: colors.ink },
  ghost: { backgroundColor: "transparent", borderColor: "transparent", color: colors.inkSoft },
});

export const buttonHovers = stylex.create({
  primary: {
    backgroundColor: {
      default: colors.ink,
      ":hover": { default: null, [HOVER]: colors.inkSoft },
      [BUTTON_PREVIEW_HOVER]: colors.inkSoft,
    },
  },
  secondary: {
    backgroundColor: {
      default: colors.surface,
      ":hover": { default: null, [HOVER]: colors.sunken },
      [BUTTON_PREVIEW_HOVER]: colors.sunken,
    },
  },
  ghost: {
    backgroundColor: {
      default: "transparent",
      ":hover": { default: null, [HOVER]: colors.sunken },
      [BUTTON_PREVIEW_HOVER]: colors.sunken,
    },
  },
});

type ButtonProps = Omit<ComponentProps<typeof BaseButton>, "className" | "style"> & {
  variant?: keyof typeof buttonVariants;
  size?: "default" | "small" | "large";
};

export function Button({ variant = "secondary", size = "default", ...props }: ButtonProps) {
  return (
    <BaseButton
      {...props}
      {...stylex.props(
        type.control,
        buttonStyles.base,
        size !== "default" && buttonStyles[size],
        buttonVariants[variant],
        props.disabled ? buttonStyles.disabled : buttonHovers[variant],
      )}
    />
  );
}
