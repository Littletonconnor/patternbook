import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";
import { colors, radius } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";

const styles = stylex.create({
  kbd: {
    display: "inline-block",
    minWidth: 20,
    paddingBlock: 1,
    paddingInline: 5,
    textAlign: "center",
    color: colors.inkSoft,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderBottomWidth: 2,
    borderStyle: "solid",
    borderColor: colors.line,
    borderRadius: radius.mark,
  },
});

export function Kbd({ children }: { children: ReactNode }) {
  return <kbd {...stylex.props(type.tag, styles.kbd)}>{children}</kbd>;
}
