import * as stylex from "@stylexjs/stylex";
import { Card, Specs } from "./Section";
import { previewProps, StateMatrix } from "./StateMatrix";
import { type } from "@/tokens/typography";
import { colors } from "@/tokens/tokens.stylex";
import { Button } from "@/ui/Button";
import { Icon } from "@/ui/Icon";
import { RotateCcw } from "lucide-react";

const styles = stylex.create({
  note: { margin: 0, color: colors.inkSoft },
});

const rows = [
  { name: "primary", variant: "primary", size: "default", label: "Load next page" },
  { name: "secondary", variant: "secondary", size: "default", label: "New post arrives" },
  { name: "ghost", variant: "ghost", size: "default", label: "Reset", icon: true },
  { name: "small", variant: "secondary", size: "small", label: "Small" },
] as const;

export function ButtonExample() {
  return (
    <Card title="Button">
      <StateMatrix
        rows={rows}
        render={(row, state) => (
          <Button variant={row.variant} size={row.size} {...previewProps(state)}>
            {"icon" in row && <Icon icon={RotateCcw} />}
            {row.label}
          </Button>
        )}
      />
      <Specs
        rows={[
          ["Status", "Src: src/ui/Button.tsx"],
          [
            "Props",
            "variant: primary | secondary (default) | ghost · size: default | small · everything else passes to Base UI",
          ],
          ["Size", "height 36 / small 32 · paddingInline 14 / 10 · icon gap space.s2 / space.s1"],
          ["Shape", "radius.control · 1px solid border"],
          ["Text", "type.control (Geist 14/20, weight 500) · no wrap"],
          [
            "Colours",
            "primary ink bg, paper text · secondary surface bg, lineStrong border, ink text · ghost transparent, inkSoft text",
          ],
          ["Hover", "pointer devices only · primary → inkSoft · secondary and ghost → sunken"],
          ["Press", "scale 0.97 · motion.press, motion.easeOut"],
          ["Focus", "2px focus outline, offset 2 · keyboard only (:focus-visible)"],
          ["Disabled", "opacity 0.5 · not-allowed cursor · no hover, no press"],
        ]}
      />
      <p {...stylex.props(type.small, styles.note)}>
        One primary per figure or section; everything else is secondary or ghost.
      </p>
    </Card>
  );
}
