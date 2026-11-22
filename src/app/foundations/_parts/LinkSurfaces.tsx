import * as stylex from "@stylexjs/stylex";
import { colors, space } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";
import { CardLink } from "@/ui/CardLink";
import { RowLink } from "@/ui/RowLink";
import { Card, Specs } from "./Section";
import { StateMatrix } from "./StateMatrix";
import type { PreviewState } from "./StateMatrix";

const styles = stylex.create({
  body: { gap: space.s1, display: "flex", flexDirection: "column" },
  media: { backgroundColor: colors.sunken, height: 48 },
  soft: { color: colors.inkSoft },
  muted: { color: colors.inkMuted },
  wide: { width: 260 },
});

const states = ["rest", "hover", "focus"] as const satisfies readonly PreviewState[];

function preview(state: PreviewState) {
  return state === "rest" ? {} : { "data-preview": state };
}

const cardRows = [
  { name: "default", use: "Lesson cards, level cards, pager" },
  { name: "none", use: "Diagram cards with an edge-to-edge stage" },
] as const;

export function CardLinkExample() {
  return (
    <Card title="CardLink">
      <StateMatrix
        rows={cardRows}
        states={states}
        render={(row, state) => (
          <span {...stylex.props(styles.wide)}>
            <CardLink href="#card-link" padding={row.name} {...preview(state)}>
              {row.name === "none" && <span {...stylex.props(styles.media)} />}
              <span {...stylex.props(styles.body)}>
                <span {...stylex.props(type.body)}>Keyset pagination</span>
                <span {...stylex.props(type.small, styles.soft)}>Page by the last row seen.</span>
              </span>
            </CardLink>
          </span>
        )}
      />
      <Specs
        rows={[
          ["Status", "Built: src/ui/CardLink.tsx, on next/link"],
          ["Props", "padding: default (space.s4) | none · every next/link prop"],
          ["Frame", "surface · 1px line border · radius.frame · column flex"],
          ["Hover", "border turns lineStrong over motion.press"],
          ["Focus", "2px focus ring, offset 2"],
          ["Content", "lay out children in one inner element; the card sets no gap"],
        ]}
      />
    </Card>
  );
}

const rowRows = [
  { name: "default", use: "Topic list, diagrams page" },
  { name: "compact", use: "Sidebar lessons" },
  { name: "current", use: "Sidebar, the open lesson" },
] as const;

export function RowLinkExample() {
  return (
    <Card title="RowLink">
      <StateMatrix
        rows={rowRows}
        states={states}
        render={(row, state) => (
          <span {...stylex.props(styles.wide)}>
            <RowLink
              href="#row-link"
              size={row.name === "default" ? "default" : "compact"}
              current={row.name === "current"}
              {...preview(state)}
            >
              <span {...stylex.props(type.number, styles.muted)}>07</span>
              <span>Keyset pagination</span>
            </RowLink>
          </span>
        )}
      />
      <Specs
        rows={[
          ["Status", "Built: src/ui/RowLink.tsx, on next/link"],
          ["Props", "size: default | compact · current: sets aria-current=page"],
          [
            "Default",
            "radius.control · gap space.s4 · padding space.s3 / space.s4 · baseline aligned · ink",
          ],
          ["Compact", "type.ui · 30 high · padding 10 · radius 6 · inkSoft, hover ink"],
          ["Hover", "sunken background"],
          ["Current", "line background · ink · weight 500"],
          ["Focus", "2px focus ring, inset"],
        ]}
      />
    </Card>
  );
}
