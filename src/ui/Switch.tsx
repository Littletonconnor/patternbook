import { Switch as BaseSwitch } from "@base-ui/react/switch";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps, ReactNode } from "react";
import { colors, motion } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";

const CHECKED = ":is([data-checked])";
const REDUCED = "@media (prefers-reduced-motion: reduce)";

const styles = stylex.create({
  row: {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    color: colors.ink,
    cursor: "pointer",
  },
  disabled: { opacity: 0.5, cursor: "not-allowed" },
  track: {
    position: "relative",
    flexShrink: 0,
    width: 36,
    height: 22,
    padding: 0,
    borderWidth: 0,
    borderRadius: 11,
    cursor: "inherit",
    backgroundColor: { default: colors.lineStrong, [CHECKED]: colors.ink },
    transitionProperty: "background-color",
    transitionDuration: { default: motion.move, [REDUCED]: "0s" },
    transitionTimingFunction: motion.easeOut,
    outlineStyle: { default: "none", ":focus-visible": "solid" },
    outlineWidth: 2,
    outlineOffset: 2,
    outlineColor: colors.focus,
  },
  thumb: {
    position: "absolute",
    top: 2,
    left: 2,
    width: 18,
    height: 18,
    borderRadius: "50%",
    backgroundColor: colors.surface,
    boxShadow: "0 0 0 0.5px rgb(22 24 29 / 0.12), 0 1px 2px rgb(22 24 29 / 0.16)",
    transform: { default: "translateX(0)", [CHECKED]: "translateX(14px)" },
    transitionProperty: "transform",
    transitionDuration: { default: motion.move, [REDUCED]: "0s" },
    transitionTimingFunction: motion.easeOut,
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
