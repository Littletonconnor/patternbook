import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";
import { colors, radius, space } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";

const styles = stylex.create({
  primitive: {
    borderColor: colors.line,
    borderRadius: radius.control,
    borderStyle: "solid",
    borderWidth: 1,
    paddingInline: space.s2,
    color: colors.ink,
  },
});

type PrimitiveProps = Omit<ComponentProps<"span">, "className" | "style">;

export function Primitive(props: PrimitiveProps) {
  return <span {...props} {...stylex.props(type.control, styles.primitive)} />;
}
