import * as stylex from "@stylexjs/stylex";

import { type } from "@/tokens/typography";
import { Link } from "@/ui/Link";

import { BrandMark } from "./BrandMark";

const styles = stylex.create({
  brand: { gap: 6, alignItems: "center", display: "inline-flex" },
});

export function Brand() {
  return (
    <Link href="/" variant="plain">
      <span {...stylex.props(styles.brand)}>
        <BrandMark size={19} />
        <span {...stylex.props(type.wordmark)}>patternbook</span>
      </span>
    </Link>
  );
}
