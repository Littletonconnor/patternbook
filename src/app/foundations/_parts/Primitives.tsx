import * as stylex from "@stylexjs/stylex";

import { space } from "@/tokens/tokens.stylex";

import { BadgeExample, KbdExample } from "./Badge";
import { ButtonExample } from "./Button";
import { CollapsibleExample } from "./CollapsibleDemo";
import { SliderExample, TabsExample, ToggleGroupExample } from "./Controls";
import { IconButtonExample } from "./IconButton";
import { LinkExample } from "./Link";
import { CardLinkExample, RowLinkExample } from "./LinkSurfaces";
import { DrawerExample, TooltipExample } from "./Overlays";
import { Section } from "./Section";
import { SwitchExample, ToggleExample } from "./ToggleControls";

const styles = stylex.create({
  grid: {
    gap: space.s4,
    display: "flex",
    flexDirection: "column",
  },
});

export function Primitives() {
  return (
    <Section
      eyebrow="04 · Primitives · src/ui"
      title="Controls: Base UI for behaviour, StyleX for the look"
      note="Hover, press and Tab to see the states. Disabled is the only one a page can show at rest."
    >
      <div {...stylex.props(styles.grid)}>
        <ButtonExample />
        <IconButtonExample />
        <LinkExample />
        <CardLinkExample />
        <RowLinkExample />
        <BadgeExample />
        <KbdExample />
        <ToggleGroupExample />
        <TabsExample />
        <SwitchExample />
        <ToggleExample />
        <SliderExample />
        <TooltipExample />
        <CollapsibleExample />
        <DrawerExample />
      </div>
    </Section>
  );
}
