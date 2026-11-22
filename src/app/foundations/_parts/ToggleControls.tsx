"use client";

import { Switch } from "@/ui/Switch";
import { Toggle } from "@/ui/Toggle";

import { Card, Specs } from "./Section";
import { ExampleRows } from "./StateMatrix";

export function SwitchExample() {
  return (
    <Card title="Switch">
      <ExampleRows
        rows={[
          {
            name: "on",
            use: "Diagram condition",
            example: <Switch label="New rows keep arriving" defaultChecked />,
          },
          { name: "off", use: "Diagram condition", example: <Switch label="Slow network" /> },
          {
            name: "disabled",
            use: "Not available yet",
            example: <Switch label="Replay" disabled />,
          },
        ]}
      />
      <Specs
        rows={[
          ["Status", "Built: src/ui/Switch.tsx, Base UI Switch"],
          ["Props", "label (required) · checked / defaultChecked / onCheckedChange · disabled"],
          ["Track", "36 × 22 · radius 11 · off lineStrong · on ink · :is([data-checked])"],
          ["Thumb", "18 × 18 surface, 2px inset, hairline shadow · moves 14px over motion.move"],
          ["Label", "type.control · gap 10 · the whole row is clickable"],
          ["Focus", "ring around the track"],
        ]}
      />
    </Card>
  );
}

export function ToggleExample() {
  return (
    <Card title="Toggle">
      <ExampleRows
        rows={[
          { name: "off", use: "Mark a lesson as read", example: <Toggle>Mark as read</Toggle> },
          {
            name: "pressed",
            use: "Lesson already read",
            example: <Toggle defaultPressed>Read</Toggle>,
          },
          {
            name: "disabled",
            use: "Not available yet",
            example: <Toggle disabled>Mark as read</Toggle>,
          },
        ]}
      />
      <Specs
        rows={[
          ["Status", "Built: src/ui/Toggle.tsx, Base UI Toggle"],
          ["Props", "pressed / defaultPressed / onPressedChange · size default | small · disabled"],
          ["Off", "secondary button: surface, lineStrong border, sunken on hover"],
          ["Pressed", "soundWash fill, sound border, soundInk text · :is([data-pressed])"],
          ["Focus", "same ring as Button"],
        ]}
      />
    </Card>
  );
}
