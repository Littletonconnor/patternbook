import * as stylex from "@stylexjs/stylex";

import { colors, radius, shadows, space } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";

import { Card, Section, Specs, Token } from "./Section";

const styles = stylex.create({
  grid: {
    gap: space.s4,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  },
  stage: {
    padding: space.s6,
    borderRadius: radius.control,
    overflow: "hidden",
    alignItems: "center",
    backgroundColor: colors.paper,
    display: "flex",
    justifyContent: "center",
    position: "relative",
    height: 160,
  },
  raised: {
    padding: space.s4,
    borderRadius: radius.frame,
    gap: space.s1,
    backgroundColor: colors.surfaceRaised,
    boxShadow: shadows.raised,
    display: "flex",
    flexDirection: "column",
    width: 180,
  },
  overlay: {
    padding: space.s2,
    borderRadius: radius.frame,
    backgroundColor: colors.surfaceOverlay,
    boxShadow: shadows.overlay,
    display: "flex",
    flexDirection: "column",
    width: 180,
  },
  item: { paddingBlock: space.s1, paddingInline: space.s2, color: colors.inkSoft },
  sheet: {
    paddingInline: space.s4,
    backgroundColor: colors.surfaceOverlay,
    boxShadow: shadows.sheet,
    position: "absolute",
    borderTopLeftRadius: radius.frame,
    borderTopRightRadius: radius.frame,
    bottom: 0,
    height: 88,
    left: space.s6,
    paddingTop: space.s3,
    right: space.s6,
  },
  handle: {
    borderRadius: 2,
    marginInline: "auto",
    backgroundColor: colors.lineStrong,
    height: 4,
    marginBottom: space.s3,
    width: 36,
  },
  muted: { color: colors.inkMuted },
});

const items = ["Foundations", "Core", "Advanced"];

export function Elevation() {
  return (
    <Section
      eyebrow="04 · Elevation"
      title="Three levels, each a stack of shadows that doubles"
      note="Each level stacks ink-tinted shadows at 1, 2, 4, 8 and 16 px. Raised uses the first two, overlay and sheet use all five, and sheet points up because the drawer comes in from the bottom. In dark mode the surface also gets lighter at each level. The page itself has no shadow."
    >
      <div {...stylex.props(styles.grid)}>
        <Card title="Raised">
          <div {...stylex.props(styles.stage)}>
            <div {...stylex.props(styles.raised)}>
              <span {...stylex.props(type.number, styles.muted)}>33</span>
              <span {...stylex.props(type.control)}>Offset vs cursor pagination</span>
            </div>
          </div>
          <Specs
            rows={[
              ["Shadow", <Token key="s">shadows.raised</Token>],
              ["Surface", <Token key="c">colors.surfaceRaised</Token>],
              ["Used by", "Switch and slider thumbs, pressed toggle, card link on hover"],
            ]}
          />
        </Card>
        <Card title="Overlay">
          <div {...stylex.props(styles.stage)}>
            <div {...stylex.props(styles.overlay)}>
              {items.map((item) => (
                <span key={item} {...stylex.props(type.ui, styles.item)}>
                  {item}
                </span>
              ))}
            </div>
          </div>
          <Specs
            rows={[
              ["Shadow", <Token key="s">shadows.overlay</Token>],
              ["Surface", <Token key="c">colors.surfaceOverlay</Token>],
              ["Used by", "Tooltip, popover, menu"],
            ]}
          />
        </Card>
        <Card title="Sheet">
          <div {...stylex.props(styles.stage)}>
            <div {...stylex.props(styles.sheet)}>
              <div {...stylex.props(styles.handle)} />
              <span {...stylex.props(type.control)}>Topics</span>
            </div>
          </div>
          <Specs
            rows={[
              ["Shadow", <Token key="s">shadows.sheet</Token>],
              ["Surface", <Token key="c">colors.surfaceOverlay</Token>],
              ["Used by", "Drawer"],
            ]}
          />
        </Card>
      </div>
    </Section>
  );
}
