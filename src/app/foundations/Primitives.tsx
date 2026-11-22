import * as stylex from "@stylexjs/stylex";
import { space } from "@/tokens/tokens.stylex";
import { Section } from "./Section";
import { ButtonExample } from "./Button";
import { IconButtonExample } from "./IconButton";
import { LinkExample } from "./Link";
import { BadgeExample, KbdExample } from "./Badge";
import { SliderExample, SwitchExample, TabsExample, ToggleGroupExample } from "./Controls";
import { CollapsibleExample, DrawerExample, TooltipExample } from "./Overlays";

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
        <BadgeExample />
        <KbdExample />
        <ToggleGroupExample />
        <TabsExample />
        <SwitchExample />
        <SliderExample />
        <TooltipExample />
        <CollapsibleExample />
        <DrawerExample />
      </div>
    </Section>
  );
}
