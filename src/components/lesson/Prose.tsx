import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";
import { colors, measure, radius, space } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";

const styles = stylex.create({
  prose: { color: colors.ink, maxWidth: measure.prose },
  h2: {
    marginBottom: space.s3,
    marginTop: { default: space.s12, ":first-child": 0 },
    scrollMarginTop: `calc(57px + ${space.s6})`,
  },
  h3: {
    fontWeight: 600,
    marginBottom: space.s2,
    marginTop: { default: space.s8, ":first-child": 0 },
    scrollMarginTop: `calc(57px + ${space.s6})`,
  },
  p: { marginBottom: space.s4, marginTop: 0 },
  list: { paddingInlineStart: 20, marginBottom: space.s4, marginTop: 0 },
  item: { marginBottom: space.s1 },
  strong: { fontWeight: 600 },
  code: {
    borderRadius: radius.mark,
    paddingBlock: 1,
    paddingInline: 5,
    backgroundColor: colors.sunken,
    lineHeight: "inherit",
    whiteSpace: "nowrap",
  },
  block: { marginBottom: space.s6 },
  breakout: {
    marginBlock: space.s8,
    width: "100cqi",
  },
});

type Children = { children: ReactNode };

export function Prose({ children }: Children) {
  return <div {...stylex.props(type.body, styles.prose)}>{children}</div>;
}

export function H2({ id, children }: Children & { id?: string }) {
  return (
    <h2 id={id} {...stylex.props(type.heading, styles.h2)}>
      {children}
    </h2>
  );
}

export function H3({ id, children }: Children & { id?: string }) {
  return (
    <h3 id={id} {...stylex.props(type.body, styles.h3)}>
      {children}
    </h3>
  );
}

export function P({ children }: Children) {
  return <p {...stylex.props(styles.p)}>{children}</p>;
}

export function List({ ordered = false, children }: Children & { ordered?: boolean }) {
  const Tag = ordered ? "ol" : "ul";
  return <Tag {...stylex.props(styles.list)}>{children}</Tag>;
}

export function Item({ children }: Children) {
  return <li {...stylex.props(styles.item)}>{children}</li>;
}

export function Strong({ children }: Children) {
  return <strong {...stylex.props(styles.strong)}>{children}</strong>;
}

export function Code({ children }: Children) {
  return <code {...stylex.props(type.code, styles.code)}>{children}</code>;
}

export function Block({ children }: Children) {
  return <div {...stylex.props(styles.block)}>{children}</div>;
}

export function Breakout({ children }: Children) {
  return <div {...stylex.props(styles.breakout)}>{children}</div>;
}
