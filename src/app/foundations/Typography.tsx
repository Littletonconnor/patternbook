import type { ReactNode } from "react";
import * as stylex from "@stylexjs/stylex";
import { colors, space } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";
import { Card, Section, Token } from "./Section";

const styles = stylex.create({
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
    gap: space.s4,
  },
  row: { display: "flex", flexDirection: "column", gap: space.s1 },
  soft: { color: colors.inkSoft },
  rule: { margin: 0, color: colors.inkSoft },
});

function Row({ spec, children }: { spec: string; children: ReactNode }) {
  return (
    <div {...stylex.props(styles.row)}>
      <Token>{spec}</Token>
      {children}
    </div>
  );
}

export function Typography() {
  return (
    <Section eyebrow="02 · Typography" title="Two voices: Geist explains, Geist Mono labels">
      <div {...stylex.props(styles.grid)}>
        <Card>
          <Row spec="type.display · 40/44 · 600 · -0.02em">
            <span {...stylex.props(type.display)}>Offset vs cursor</span>
          </Row>
          <Row spec="type.title · 28/34 · 600 · -0.015em">
            <span {...stylex.props(type.title)}>Why page two repeats a row</span>
          </Row>
          <Row spec="type.heading · 20/28 · 600 · -0.01em">
            <span {...stylex.props(type.heading)}>The list moved while you were reading</span>
          </Row>
          <Row spec="type.body · 16/26 · 400">
            <span {...stylex.props(type.body)}>
              An offset is a position, and positions shift whenever the list changes. A cursor is a
              value, and values stay put.
            </span>
          </Row>
          <Row spec="type.small · 14/22 · 400">
            <span {...stylex.props(type.small, styles.soft)}>
              Used for sidebar items, captions under figures and secondary notes.
            </span>
          </Row>
          <Row spec="type.control · 14/20 · 500">
            <span {...stylex.props(type.control)}>Load next page · Offset · Cursor</span>
          </Row>
        </Card>
        <Card>
          <Row spec="type.label · 12/16 · 500 · +0.06em · uppercase">
            <span {...stylex.props(type.label)}>Fig 33.1 · Page window</span>
          </Row>
          <Row spec="type.code · 14/22 · 400">
            <span {...stylex.props(type.code)}>
              SELECT * FROM posts
              <br />
              WHERE id &lt; 9 ORDER BY id DESC LIMIT 4
            </span>
          </Row>
          <Row spec="type.readout · 28/32 · 500 · tabular numerals">
            <span {...stylex.props(type.readout)}>12 rows · 240 ms</span>
          </Row>
          <p {...stylex.props(type.small, styles.rule)}>
            Rule of thumb: if it is part of a figure or names something in code, it is mono.
            Everything a person reads as a sentence is Geist.
          </p>
        </Card>
      </div>
    </Section>
  );
}
