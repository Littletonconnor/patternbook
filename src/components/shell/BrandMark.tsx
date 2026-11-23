import * as stylex from "@stylexjs/stylex";

import { colors } from "@/tokens/tokens.stylex";

import { markDotRadius, markDots, markSignal, markViewBox } from "./markShape";

const styles = stylex.create({
  mark: { display: "block", flexShrink: 0 },
  dot: { fill: colors.ink },
  signal: { fill: colors.signal },
});

export function BrandMark({ size }: { size: number }) {
  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox={markViewBox}
      {...stylex.props(styles.mark)}
    >
      {markDots.map(({ cx, cy }) => (
        <circle
          key={`${cx}-${cy}`}
          cx={cx}
          cy={cy}
          r={markDotRadius}
          {...stylex.props(styles.dot)}
        />
      ))}
      <circle {...markSignal} {...stylex.props(styles.signal)} />
    </svg>
  );
}
