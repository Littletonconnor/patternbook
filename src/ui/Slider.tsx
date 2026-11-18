import { Slider as BaseSlider } from "@base-ui/react/slider";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps, ReactNode } from "react";
import { colors, motion, space } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";

const HOVER = "@media (hover: hover)";

const styles = stylex.create({
  root: { display: "flex", flexDirection: "column", gap: space.s1, width: "100%" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    gap: space.s3,
  },
  label: { color: colors.inkSoft },
  value: { color: colors.ink },
  control: {
    display: "flex",
    alignItems: "center",
    height: 20,
    cursor: "pointer",
    touchAction: "none",
    userSelect: "none",
  },
  track: {
    position: "relative",
    width: "100%",
    height: 2,
    borderRadius: 1,
    backgroundColor: colors.line,
  },
  indicator: { height: "100%", borderRadius: 1, backgroundColor: colors.ink },
  thumb: {
    width: 14,
    height: 14,
    borderRadius: "50%",
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderStyle: "solid",
    borderColor: colors.ink,
    transform: {
      default: null,
      ":hover": { default: null, [HOVER]: "scale(1.15)" },
      ":is([data-dragging])": "scale(1.15)",
    },
    transitionProperty: "transform",
    transitionDuration: motion.press,
    transitionTimingFunction: motion.easeOut,
    outlineStyle: { default: "none", ":has(:focus-visible)": "solid" },
    outlineWidth: 2,
    outlineOffset: 2,
    outlineColor: colors.focus,
  },
});

type SliderProps = Omit<
  ComponentProps<typeof BaseSlider.Root<number>>,
  "className" | "style" | "children"
> & {
  label: ReactNode;
  unit?: string;
  /** full control over the readout, e.g. (v) => `${v}×`; wins over `unit` */
  renderValue?: (value: number) => ReactNode;
};

export function Slider({ label, unit, renderValue, ...props }: SliderProps) {
  return (
    <BaseSlider.Root {...props} {...stylex.props(styles.root)}>
      <div {...stylex.props(styles.header)}>
        <BaseSlider.Label {...stylex.props(type.ui, styles.label)}>{label}</BaseSlider.Label>
        <BaseSlider.Value {...stylex.props(type.value, styles.value)}>
          {(formatted, values) =>
            renderValue ? renderValue(values[0]) : unit ? `${formatted[0]} ${unit}` : formatted[0]
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
