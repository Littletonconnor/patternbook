import { Switch as BaseSwitch } from "@base-ui/react/switch";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps, ReactNode } from "react";

import { colors, motion, shadows } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";

const CHECKED = ":is([data-checked])";
const REDUCED = "@media (prefers-reduced-motion: reduce)";

const styles = stylex.create({
  row: {
    gap: 10,
    alignItems: "center",
    color: colors.ink,
    cursor: "pointer",
    display: "inline-flex",
  },
  disabled: { cursor: "not-allowed", opacity: 0.5 },
  track: {
    padding: 0,
    borderRadius: 11,
    borderWidth: 0,
    backgroundColor: { [CHECKED]: colors.ink, default: colors.lineStrong },
    cursor: "inherit",
    flexShrink: 0,
    outlineColor: colors.focus,
    outlineOffset: 2,
    outlineStyle: { default: "none", ":focus-visible": "solid" },
    outlineWidth: 2,
    position: "relative",
    transitionDuration: { [REDUCED]: "0s", default: motion.move },
    transitionProperty: "background-color",
    transitionTimingFunction: motion.easeOut,
    height: 22,
    width: 36,
  },
  thumb: {
    borderRadius: "50%",
    backgroundColor: colors.surfaceRaised,
    boxShadow: shadows.raised,
    position: "absolute",
    transform: { [CHECKED]: "translateX(14px)", default: "translateX(0)" },
    transitionDuration: { [REDUCED]: "0s", default: motion.move },
    transitionProperty: "transform",
    transitionTimingFunction: motion.easeOut,
    height: 18,
    left: 2,
    top: 2,
    width: 18,
  },
});

type SwitchProps = Omit<ComponentProps<typeof BaseSwitch.Root>, "className" | "style"> & {
  label: ReactNode;
};

export function Switch({ label, ...props }: SwitchProps) {
  return (
    <label {...stylex.props(type.control, styles.row, props.disabled && styles.disabled)}>
      <BaseSwitch.Root {...props} {...stylex.props(styles.track)}>
        <BaseSwitch.Thumb {...stylex.props(styles.thumb)} />
      </BaseSwitch.Root>
      {label}
    </label>
  );
}
