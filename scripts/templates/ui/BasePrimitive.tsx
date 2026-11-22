"use client";

import { Toggle as BasePrimitive } from "@base-ui/react/toggle";
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

type PrimitiveProps = Omit<ComponentProps<typeof BasePrimitive>, "className" | "style" | "render">;

export function Primitive(props: PrimitiveProps) {
  return <BasePrimitive {...props} {...stylex.props(type.control, styles.primitive)} />;
}
