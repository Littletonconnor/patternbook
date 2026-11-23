"use client";

import { Toggle } from "@base-ui/react/toggle";
import { ToggleGroup as BaseToggleGroup } from "@base-ui/react/toggle-group";
import * as stylex from "@stylexjs/stylex";
import { useState } from "react";
import type { ReactNode } from "react";

import { colors, radius, shadows, space } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";

const HOVER = "@media (hover: hover)";
const PRESSED = ":is([data-pressed])";

const styles = stylex.create({
  track: {
    padding: 2,
    borderRadius: radius.control,
    gap: 2,
    backgroundColor: colors.sunken,
    display: "inline-flex",
  },
  trackSmall: { display: "flex", minWidth: "100%", width: "max-content" },
  item: {
    borderColor: "transparent",
    borderRadius: 6,
    borderStyle: "solid",
    borderWidth: 1,
    paddingBlock: 5,
    paddingInline: space.s3,
    backgroundColor: { [PRESSED]: colors.surfaceRaised, default: "transparent" },
    boxShadow: { [PRESSED]: shadows.raised, default: "none" },
    color: {
      [PRESSED]: colors.ink,
      default: colors.inkSoft,
      ":hover": { [HOVER]: colors.ink, default: null },
    },
    cursor: "pointer",
    fontWeight: { [PRESSED]: 500, default: 400 },
    outlineColor: colors.focus,
    outlineOffset: 1,
    outlineStyle: { default: "none", ":focus-visible": "solid" },
    outlineWidth: 2,
    whiteSpace: "nowrap",
  },
  itemSmall: {
    paddingBlock: 6,
    paddingInline: space.s2,
    flexBasis: "auto",
    flexGrow: 1,
    outlineOffset: -2,
  },
});

type Option<T extends string> = { value: T; label: ReactNode };

type ToggleGroupProps<T extends string> = {
  options: readonly Option<T>[];
  value?: T;
  defaultValue?: T;
  onValueChange?: (value: T) => void;
  size?: "default" | "small";
  "aria-label": string;
};

export function ToggleGroup<T extends string>({
  options,
  value,
  defaultValue,
  onValueChange,
  size = "default",
  "aria-label": ariaLabel,
}: ToggleGroupProps<T>) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue ?? options[0]?.value);
  const current = value ?? uncontrolled;
  const small = size === "small";

  return (
    <BaseToggleGroup
      aria-label={ariaLabel}
      value={current ? [current] : []}
      onValueChange={(next) => {
        const picked = options.find((option) => option.value === next[0])?.value;
        if (!picked) {
          return;
        }
        setUncontrolled(picked);
        onValueChange?.(picked);
      }}
      {...stylex.props(styles.track, small && styles.trackSmall)}
    >
      {options.map((option) => (
        <Toggle
          key={option.value}
          value={option.value}
          {...stylex.props(
            small ? type.caption : type.control,
            styles.item,
            small && styles.itemSmall,
          )}
        >
          {option.label}
        </Toggle>
      ))}
    </BaseToggleGroup>
  );
}
