import { Slider as BaseSlider } from "@base-ui/react/slider";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps, ReactNode } from "react";
import { colors, motion, space } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";

const HOVER = "@media (hover: hover)";

const styles = stylex.create({
  root: { gap: space.s1, display: "flex", flexDirection: "column", width: "100%" },
  header: {
    gap: space.s3,
    alignItems: "baseline",
    display: "flex",
    justifyContent: "space-between",
  },
  label: { color: colors.inkSoft },
  value: { color: colors.ink },
  control: {
    alignItems: "center",
    cursor: "pointer",
    display: "flex",
    touchAction: "none",
    userSelect: "none",
    height: 20,
  },
  track: {
    borderRadius: 1,
    backgroundColor: colors.line,
    position: "relative",
    height: 2,
    width: "100%",
  },
  indicator: { borderRadius: 1, backgroundColor: colors.ink, height: "100%" },
  thumb: {
    borderColor: colors.ink,
    borderRadius: "50%",
    borderStyle: "solid",
    borderWidth: 1.5,
    backgroundColor: colors.surface,
    outlineColor: colors.focus,
    outlineOffset: 2,
    outlineStyle: { default: "none", ":has(:focus-visible)": "solid" },
    outlineWidth: 2,
    transform: {
      default: null,
      ":is([data-dragging])": "scale(1.15)",
      ":hover": { [HOVER]: "scale(1.15)", default: null },
    },
    transitionDuration: motion.press,
    transitionProperty: "transform",
    transitionTimingFunction: motion.easeOut,
    height: 14,
    width: 14,
  },
});

type SliderProps = Omit<
  ComponentProps<typeof BaseSlider.Root<number>>,
  "className" | "style" | "children"
> & {
  label: ReactNode;
  unit?: string;
  renderValue?: (value: number) => ReactNode;
};

type Readout = {
  formatted: string | undefined;
  value: number | undefined;
  unit: string | undefined;
  renderValue: ((value: number) => ReactNode) | undefined;
};

function formatValue({ formatted, value, unit, renderValue }: Readout): ReactNode {
  if (renderValue && value !== undefined) {
    return renderValue(value);
  }
  if (unit) {
    return `${formatted} ${unit}`;
  }
  return formatted;
}

export function Slider({ label, unit, renderValue, ...props }: SliderProps) {
  return (
    <BaseSlider.Root {...props} {...stylex.props(styles.root)}>
      <div {...stylex.props(styles.header)}>
        <BaseSlider.Label {...stylex.props(type.ui, styles.label)}>{label}</BaseSlider.Label>
        <BaseSlider.Value {...stylex.props(type.value, styles.value)}>
          {(formatted, values) =>
            formatValue({ formatted: formatted[0], value: values[0], unit, renderValue })
          }
        </BaseSlider.Value>
      </div>
      <BaseSlider.Control {...stylex.props(styles.control)}>
        <BaseSlider.Track {...stylex.props(styles.track)}>
          <BaseSlider.Indicator {...stylex.props(styles.indicator)} />
          <BaseSlider.Thumb {...stylex.props(styles.thumb)} />
        </BaseSlider.Track>
      </BaseSlider.Control>
    </BaseSlider.Root>
  );
}
