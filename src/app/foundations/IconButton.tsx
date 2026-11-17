import * as stylex from "@stylexjs/stylex";
import { Card, Specs } from "./Section";
import { type } from "@/tokens/typography";
import { colors } from "@/tokens/tokens.stylex";
import { IconButton } from "@/ui/IconButton";
import { Copy, Menu, Play, RotateCcw, StepForward } from "lucide-react";
import { StateMatrix, previewProps } from "./StateMatrix";

const styles = stylex.create({
  note: { margin: 0, color: colors.inkSoft },
});

const rows = [
  {
    name: "secondary",
    use: "Play in a transport",
    variant: "secondary",
    size: "default",
    icon: Play,
    label: "Play",
  },
  {
    name: "ghost",
    use: "Step in a transport",
    variant: "ghost",
    size: "default",
    icon: StepForward,
    label: "Step forward",
  },
  {
    name: "ghost",
    use: "Reset a figure",
    variant: "ghost",
    size: "default",
    icon: RotateCcw,
    label: "Reset",
  },
  {
    name: "ghost · small",
    use: "Copy in a code block",
    variant: "ghost",
    size: "small",
    icon: Copy,
    label: "Copy code",
  },
  {
    name: "ghost",
    use: "Menu on a phone",
    variant: "ghost",
    size: "default",
    icon: Menu,
    label: "Open menu",
  },
] as const;

export function IconButtonExample() {
  return (
    <Card title="IconButton">
      <StateMatrix
        rows={rows}
        render={(row, state) => (
          <IconButton
            icon={row.icon}
            label={row.label}
            variant={row.variant}
            size={row.size}
            {...previewProps(state)}
          />
        )}
      />
      <Specs
        rows={[
          ["Status", "Built: src/ui/IconButton.tsx"],
          [
            "Props",
            "icon: a Lucide icon · label: required, becomes aria-label (and later the Tooltip) · variant: secondary | ghost (default) · size: default | small",
          ],
          ["Size", "36 × 36 / small 32 × 32 · no padding · icon 16, stroke 1.5"],
          ["States", "shared with Button: hover, press, focus ring, disabled, data-preview"],
          ["Pairs with", "Tooltip showing the label after a short delay (once Tooltip exists)"],
        ]}
      />
      <p {...stylex.props(type.small, styles.note)}>
        Transport controls, Copy in code blocks, the mobile menu. Never icon-only without a label.
      </p>
    </Card>
  );
}
