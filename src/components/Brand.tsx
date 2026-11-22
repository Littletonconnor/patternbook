import NextLink from "next/link";
import * as stylex from "@stylexjs/stylex";
import { colors, radius } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";

const styles = stylex.create({
  brand: {
    borderRadius: radius.mark,
    gap: 10,
    alignItems: "center",
    color: colors.ink,
    display: "inline-flex",
    outlineColor: colors.focus,
    outlineOffset: 2,
    outlineStyle: { default: "none", ":focus-visible": "solid" },
    outlineWidth: 2,
    textDecorationLine: "none",
  },
  mark: {
    backgroundPosition: "center",
    borderColor: colors.ink,
    borderRadius: 5,
    borderStyle: "solid",
    borderWidth: 1.5,
    backgroundImage: `radial-gradient(${colors.lineStrong} 1px, transparent 1.2px)`,
    backgroundSize: "5px 5px",
    flexShrink: 0,
    position: "relative",
    height: 22,
    width: 22,
  },
  dot: {
    borderRadius: "50%",
    backgroundColor: colors.signal,
    position: "absolute",
    transform: "translate(-50%, -50%)",
    height: 7,
    left: "50%",
    top: "50%",
    width: 7,
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
