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
    borderRadius: radius.control,
    borderStyle: "solid",
    borderWidth: 1,
    gap: space.s2,
    paddingInline: 14,
    alignItems: "center",
    cursor: "pointer",
    display: "inline-flex",
    justifyContent: "center",
    outlineColor: colors.focus,
    outlineOffset: 2,
    outlineStyle: { [BUTTON_PREVIEW_FOCUS]: "solid", default: "none", ":focus-visible": "solid" },
    outlineWidth: 2,
    transform: { [BUTTON_PREVIEW_PRESSED]: "scale(0.97)", default: null, ":active": "scale(0.97)" },
    transitionDuration: motion.press,
    transitionProperty: "background-color, transform",
    transitionTimingFunction: motion.easeOut,
    whiteSpace: "nowrap",
    height: 36,
  },
  small: { gap: space.s1, paddingInline: 10, height: 32 },
  large: { paddingInline: 18, height: 44 },
  disabled: { cursor: "not-allowed", opacity: 0.5, transform: null },
});

export const buttonVariants = stylex.create({
  primary: { borderColor: colors.ink, backgroundColor: colors.ink, color: colors.paper },
  secondary: { borderColor: colors.lineStrong, backgroundColor: colors.surface, color: colors.ink },
  ghost: { borderColor: "transparent", backgroundColor: "transparent", color: colors.inkSoft },
});

export const buttonHovers = stylex.create({
  primary: {
    backgroundColor: {
      [BUTTON_PREVIEW_HOVER]: colors.inkSoft,
      default: colors.ink,
      ":hover": { [HOVER]: colors.inkSoft, default: null },
    },
  },
  secondary: {
    backgroundColor: {
      [BUTTON_PREVIEW_HOVER]: colors.sunken,
      default: colors.surface,
      ":hover": { [HOVER]: colors.sunken, default: null },
    },
  },
  ghost: {
    backgroundColor: {
      [BUTTON_PREVIEW_HOVER]: colors.sunken,
      default: "transparent",
      ":hover": { [HOVER]: colors.sunken, default: null },
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
