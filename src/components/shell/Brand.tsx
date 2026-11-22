import * as stylex from "@stylexjs/stylex";

import { colors } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";
import { Link } from "@/ui/Link";

const styles = stylex.create({
  brand: { gap: 10, alignItems: "center", display: "inline-flex" },
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
    <Link href="/" variant="plain">
      <span {...stylex.props(styles.brand)}>
        <span aria-hidden {...stylex.props(styles.mark)}>
          <span {...stylex.props(styles.dot)} />
        </span>
        <span {...stylex.props(type.control, styles.word)}>Patternbook</span>
      </span>
    </Link>
  );
}
