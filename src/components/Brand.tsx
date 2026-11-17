import NextLink from "next/link";
import * as stylex from "@stylexjs/stylex";
import { colors, radius } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";

const styles = stylex.create({
  brand: {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    color: colors.ink,
    textDecorationLine: "none",
    borderRadius: radius.mark,
    outlineStyle: { default: "none", ":focus-visible": "solid" },
    outlineWidth: 2,
    outlineOffset: 2,
    outlineColor: colors.focus,
  },
  mark: {
    position: "relative",
    flexShrink: 0,
    width: 22,
    height: 22,
    borderWidth: 1.5,
    borderStyle: "solid",
    borderColor: colors.ink,
    borderRadius: 5,
    backgroundImage: `radial-gradient(${colors.lineStrong} 1px, transparent 1.2px)`,
    backgroundSize: "5px 5px",
    backgroundPosition: "center",
  },
  dot: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 7,
    height: 7,
    borderRadius: "50%",
    backgroundColor: colors.signal,
    transform: "translate(-50%, -50%)",
  },
  word: { fontWeight: 600 },
});

export function Brand() {
  return (
    <NextLink href="/" {...stylex.props(styles.brand)}>
      <span aria-hidden {...stylex.props(styles.mark)}>
        <span {...stylex.props(styles.dot)} />
      </span>
      <span {...stylex.props(type.control, styles.word)}>Patternbook</span>
    </NextLink>
  );
}
