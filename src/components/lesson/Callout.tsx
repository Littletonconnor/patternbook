import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";
import { colors, radius, space } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";

const styles = stylex.create({
  box: {
    borderRadius: radius.control,
    gap: space.s1,
    paddingBlock: 14,
    paddingInline: space.s4,
    color: colors.ink,
    display: "flex",
    flexDirection: "column",
  },
  body: { margin: 0 },
});

const kinds = stylex.create({
  note: { backgroundColor: colors.sunken },
  pitfall: { backgroundColor: colors.faultWash },
});

const labels = stylex.create({
  note: { color: colors.inkSoft },
  pitfall: { color: colors.faultInk },
});

type Kind = keyof typeof kinds;

const names: Record<Kind, string> = { note: "Note", pitfall: "Pitfall" };

export function Callout({ kind = "note", children }: { kind?: Kind; children: ReactNode }) {
  return (
    <aside {...stylex.props(styles.box, kinds[kind])}>
      <span {...stylex.props(type.labelSmall, labels[kind])}>{names[kind]}</span>
      <p {...stylex.props(type.small, styles.body)}>{children}</p>
    </aside>
  );
}
