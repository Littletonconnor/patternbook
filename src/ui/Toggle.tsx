"use client";

import { Toggle as BaseToggle } from "@base-ui/react/toggle";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";
import { colors } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";
import { buttonStyles } from "./Button";

const PRESSED = ":is([data-pressed])";
const HOVER = "@media (hover: hover)";

const styles = stylex.create({
  toggle: {
    borderColor: { [PRESSED]: colors.sound, default: colors.lineStrong },
    backgroundColor: {
      [PRESSED]: colors.soundWash,
      default: colors.surface,
      ":hover": { [HOVER]: colors.sunken, default: null },
    },
    color: { [PRESSED]: colors.soundInk, default: colors.ink },
  },
});

type ToggleProps = Omit<ComponentProps<typeof BaseToggle>, "className" | "style" | "render"> & {
  size?: "default" | "small";
};

export function Toggle({ size = "default", ...props }: ToggleProps) {
  return (
    <BaseToggle
      {...props}
      {...stylex.props(
        type.control,
        buttonStyles.base,
        size === "small" && buttonStyles.small,
        styles.toggle,
        props.disabled && buttonStyles.disabled,
      )}
    />
  );
}
