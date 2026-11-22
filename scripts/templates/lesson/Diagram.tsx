"use client";

import * as stylex from "@stylexjs/stylex";
import { colors, radius } from "@/tokens/tokens.stylex";

const styles = stylex.create({
  stage: {
    borderColor: colors.line,
    borderRadius: radius.frame,
    borderStyle: "solid",
    borderWidth: 1,
    backgroundColor: colors.sunken,
    display: "block",
    width: "100%",
  },
});

export function Diagram() {
  return (
    <svg
      viewBox="0 0 640 360"
      role="img"
      aria-label="Diagram title"
      {...stylex.props(styles.stage)}
    />
  );
}
