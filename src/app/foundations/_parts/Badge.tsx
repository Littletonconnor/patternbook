import * as stylex from "@stylexjs/stylex";
import { type } from "@/tokens/typography";
import { Badge } from "@/ui/Badge";
import { Kbd } from "@/ui/Kbd";
import { Card, Specs } from "./Section";
import { ExampleRows } from "./StateMatrix";

export function BadgeExample() {
  return (
    <Card title="Badge">
      <ExampleRows
        rows={[
          {
            name: "status",
            use: "Lesson rows and cards",
            example: (
              <>
                <Badge>Soon</Badge>
                <Badge tone="read">Read</Badge>
                <Badge tone="new">New</Badge>
              </>
            ),
          },
          {
            name: "level",
            use: "Lesson header and cards",
            example: (
              <>
                <Badge level="foundations" />
                <Badge level="core" />
                <Badge level="advanced" />
              </>
            ),
          },
          {
            name: "kind",
            use: "Diagrams page",
            example: (
              <>
                <Badge tone="kind">Race</Badge>
                <Badge tone="kind">Timeline</Badge>
              </>
            ),
          },
        ]}
      />
      <Specs
        rows={[
          ["Status", "Built: src/ui/Badge.tsx, a plain span"],
          [
            "Props",
            "tone: neutral (default) | read | new | kind · or level: foundations | core | advanced (fills in its own name)",
          ],
          ["Text", "type.tag (Geist Mono 11/16, 500) · never uppercase"],
          ["Box", "padding 2 × 7 · radius.mark · 1px border, transparent unless noted"],
          [
            "Tones",
            "neutral sunken / inkSoft · read soundWash / soundInk · new signalWash / signalInk",
          ],
          ["Level", "Foundations ink fill · Core inkSoft fill · Advanced surface, ink border"],
          ["Kind", "transparent, lineStrong border, ink text"],
        ]}
      />
    </Card>
  );
}

export function KbdExample() {
  return (
    <Card title="Kbd">
      <ExampleRows
        rows={[
          { name: "shortcut", use: "Search trigger", example: <Kbd>⌘K</Kbd> },
          {
            name: "keys",
            use: "Diagram controls",
            example: (
              <>
                <Kbd>Space</Kbd>
                <Kbd>←</Kbd>
                <Kbd>→</Kbd>
              </>
            ),
          },
          {
            name: "in a sentence",
            use: "Diagram captions",
            example: (
              <span {...stylex.props(type.small)}>
                Press <Kbd>Space</Kbd> to step.
              </span>
            ),
          },
        ]}
      />
      <Specs
        rows={[
          ["Status", "Built: src/ui/Kbd.tsx, a kbd element"],
          ["Text", "type.tag · inkSoft"],
          ["Box", "padding 1 × 5 · surface · 1px line border, 2px at the bottom · radius.mark"],
          ["Use", "keyboard hints in the search trigger, diagram captions and tooltips"],
        ]}
      />
    </Card>
  );
}
