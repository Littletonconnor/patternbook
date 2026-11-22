import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";

import { colors, radius } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";

const styles = stylex.create({
  kbd: {
    borderColor: colors.line,
    borderRadius: radius.mark,
    borderStyle: "solid",
    borderWidth: 1,
    paddingBlock: 1,
    paddingInline: 5,
    backgroundColor: colors.surface,
    color: colors.inkSoft,
    display: "inline-block",
    textAlign: "center",
    borderBottomWidth: 2,
    minWidth: 20,
  },
});

export function Kbd({ children }: { children: ReactNode }) {
  return <kbd {...stylex.props(type.tag, styles.kbd)}>{children}</kbd>;
}
