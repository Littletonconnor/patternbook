"use client";

import { ToggleGroup as BaseToggleGroup } from "@base-ui/react/toggle-group";
import { Toggle } from "@base-ui/react/toggle";
import * as stylex from "@stylexjs/stylex";
import { useState, type ReactNode } from "react";
import { colors, radius } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";

const HOVER = "@media (hover: hover)";
const PRESSED = ":is([data-pressed])";

const styles = stylex.create({
  track: {
    display: "inline-flex",
    gap: 2,
    padding: 2,
    backgroundColor: colors.sunken,
    borderRadius: radius.control,
  },
  trackSmall: { display: "flex", width: "100%" },
  item: {
    paddingBlock: 5,
    paddingInline: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderStyle: "solid",
    whiteSpace: "nowrap",
    cursor: "pointer",
    backgroundColor: { default: "transparent", [PRESSED]: colors.surface },
    borderColor: { default: "transparent", [PRESSED]: colors.line },
    color: {
      default: colors.inkSoft,
      ":hover": { default: null, [HOVER]: colors.ink },
      [PRESSED]: colors.ink,
    },
    fontWeight: { default: 400, [PRESSED]: 500 },
    outlineStyle: { default: "none", ":focus-visible": "solid" },
    outlineWidth: 2,
    outlineOffset: 1,
    outlineColor: colors.focus,
  },
  itemSmall: {
    flexGrow: 1,
    flexBasis: 0,
    paddingBlock: 6,
    paddingInline: 0,
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
        const picked = next[0] as T | undefined;
        if (!picked) return;
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
