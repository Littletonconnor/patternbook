"use client";

import * as stylex from "@stylexjs/stylex";
import { colors, space } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";
import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "@/ui/Collapsible";
import { Card, Specs } from "./Section";
import { ExampleRows } from "./StateMatrix";

const styles = stylex.create({
  sidebar: { display: "flex", flexDirection: "column", maxWidth: 260, width: "100%" },
  lessons: { paddingBlock: space.s1, display: "flex", flexDirection: "column" },
  lesson: {
    gap: space.s2,
    paddingBlock: 4,
    color: colors.inkSoft,
    display: "flex",
    paddingInlineStart: 30,
  },
  number: { color: colors.inkMuted },
});

const topics = [
  { name: "Git", meta: "2", lessons: [] },
  {
    name: "APIs",
    meta: "1/6",
    lessons: [
      { number: 32, title: "Stateless servers" },
      { number: 33, title: "Offset vs cursor" },
    ],
  },
];

function TopicsSample() {
  return (
    <div {...stylex.props(styles.sidebar)}>
      {topics.map((topic) => (
        <Collapsible key={topic.name} defaultOpen={topic.name === "APIs"}>
          <CollapsibleTrigger meta={topic.meta}>{topic.name}</CollapsibleTrigger>
          <CollapsiblePanel>
            <div {...stylex.props(styles.lessons)}>
              {topic.lessons.map((lesson) => (
                <span key={lesson.number} {...stylex.props(type.ui, styles.lesson)}>
                  <span {...stylex.props(type.number, styles.number)}>{lesson.number}</span>
                  {lesson.title}
                </span>
              ))}
            </div>
          </CollapsiblePanel>
        </Collapsible>
      ))}
    </div>
  );
}

export function CollapsibleExample() {
  return (
    <Card title="Collapsible">
      <ExampleRows
        rows={[
          {
            name: "sidebar topic",
            use: "APIs starts open",
            example: <TopicsSample />,
          },
        ]}
      />
      <Specs
        rows={[
          [
            "Status",
            "Built: src/ui/Collapsible.tsx, Base UI Collapsible (Collapsible, CollapsibleTrigger, CollapsiblePanel)",
          ],
          [
            "Trigger",
            "padding 6 × 10 · radius 6 · type.ui · closed inkSoft · open ink 600 · hover sunken",
          ],
          ["Chevron", "12px, points right; rotates 90° when open over motion.move"],
          [
            "Panel",
            "height animates from 0 with --collapsible-panel-height · motion.move, easeOut",
          ],
          ["Reduced motion", "no height animation, opens instantly"],
        ]}
      />
    </Card>
  );
}
