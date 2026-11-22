"use client";

import * as stylex from "@stylexjs/stylex";
import { useState } from "react";
import { colors, space } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";
import { Slider } from "@/ui/Slider";
import { Tab, Tabs, TabsList, TabsPanel } from "@/ui/Tabs";
import { ToggleGroup } from "@/ui/ToggleGroup";
import { Card, Specs } from "./Section";
import { ExampleRows } from "./StateMatrix";

const styles = stylex.create({
  wide: { maxWidth: 320, width: "100%" },
  muted: { margin: 0, color: colors.inkMuted },
  code: {
    margin: 0,
    color: colors.inkSoft,
    paddingTop: space.s3,
  },
});
const modes = [
  { value: "offset", label: "Offset" },
  { value: "cursor", label: "Cursor" },
  { value: "both", label: "Both" },
] as const;

const levels = [
  { value: "all", label: "All" },
  { value: "foundations", label: "Foundations" },
  { value: "core", label: "Core" },
  { value: "advanced", label: "Advanced" },
] as const;

export function ToggleGroupExample() {
  const [mode, setMode] = useState<(typeof modes)[number]["value"]>("cursor");
  return (
    <Card title="ToggleGroup">
      <ExampleRows
        rows={[
          {
            name: "default",
            use: "Diagram mode switch",
            example: (
              <>
                <ToggleGroup
                  aria-label="Pagination"
                  options={modes}
                  value={mode}
                  onValueChange={setMode}
                />
                <span {...stylex.props(type.small, styles.muted)}>showing {mode}</span>
              </>
            ),
          },
          {
            name: "small",
            use: "Sidebar level filter",
            example: (
              <div {...stylex.props(styles.wide)}>
                <ToggleGroup aria-label="Level" size="small" options={levels} />
              </div>
            ),
          },
        ]}
      />
      <Specs
        rows={[
          ["Status", "Built: src/ui/ToggleGroup.tsx, Base UI ToggleGroup + Toggle"],
          [
            "Props",
            "options: { value, label }[] · value / defaultValue / onValueChange (one string) · size: default | small · aria-label required",
          ],
          ["Behaviour", "exactly one option is on; pressing it again does nothing"],
          ["Track", "sunken · padding 2 · gap 2 · radius.control"],
          [
            "Item",
            "padding 5 × 12, type.control · small: 6 × 0, type.caption, items share the width",
          ],
          ["On", "surface, 1px line border, ink, weight 500 · styled with :is([data-pressed])"],
          ["Motion", "none: the switch is instant so a diagram can be compared before and after"],
        ]}
      />
    </Card>
  );
}

const snippets = {
  sql: "SELECT * FROM rows WHERE id > $cursor ORDER BY id LIMIT 4;",
  ts: "const page = await db.rows.after(cursor).take(4);",
  http: "GET /rows?after=c_42&limit=4",
};

export function TabsExample() {
  return (
    <Card title="Tabs">
      <ExampleRows
        rows={[
          {
            name: "code languages",
            use: "Code blocks, diagram views",
            example: (
              <div {...stylex.props(styles.wide)}>
                <Tabs defaultValue="sql">
                  <TabsList>
                    <Tab value="sql">SQL</Tab>
                    <Tab value="ts">TypeScript</Tab>
                    <Tab value="http">HTTP</Tab>
                  </TabsList>
                  {Object.entries(snippets).map(([key, code]) => (
                    <TabsPanel key={key} value={key}>
                      <pre {...stylex.props(type.codeSmall, styles.code)}>{code}</pre>
                    </TabsPanel>
                  ))}
                </Tabs>
              </div>
            ),
          },
        ]}
      />
      <Specs
        rows={[
          ["Status", "Built: src/ui/Tabs.tsx, Base UI Tabs (Tabs, TabsList, Tab, TabsPanel)"],
          ["List", "1px line bottom border · gap 20 · draws the indicator itself"],
          ["Tab", "type.codeSmall · inkSoft · bottom padding 10 · hover ink"],
          ["Selected", "ink, weight 500 · Base UI marks it :is([data-active])"],
          [
            "Indicator",
            "2px ink bar on the list border · slides between tabs over motion.move, motion.easeOut",
          ],
          ["Focus", "ring on the tab, inset 2px so it is not clipped"],
        ]}
      />
    </Card>
  );
}

export function SliderExample() {
  return (
    <Card title="Slider">
      <ExampleRows
        rows={[
          {
            name: "count",
            use: "Page size",
            example: (
              <div {...stylex.props(styles.wide)}>
                <Slider label="Page size" defaultValue={4} min={1} max={10} />
              </div>
            ),
          },
          {
            name: "with unit",
            use: "Latency",
            example: (
              <div {...stylex.props(styles.wide)}>
                <Slider label="Latency" unit="ms" defaultValue={240} min={0} max={1000} step={20} />
              </div>
            ),
          },
        ]}
      />
      <Specs
        rows={[
          ["Status", "Built: src/ui/Slider.tsx, Base UI Slider"],
          ["Props", "label · unit · value / defaultValue / onValueChange · min, max, step"],
          ["Track", "2px · line · filled part ink · hit area 20 high"],
          ["Thumb", "14 × 14 surface, 1.5px ink border · hover and drag: scale 1.15 · focus ring"],
          ["Label", "type.ui inkSoft on the left · value in type.value on the right"],
        ]}
      />
    </Card>
  );
}
