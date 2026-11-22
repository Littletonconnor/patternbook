"use client";

import * as stylex from "@stylexjs/stylex";
import { Menu, StepForward } from "lucide-react";
import { colors, space } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";
import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "@/ui/Collapsible";
import { Button } from "@/ui/Button";
import { Drawer } from "@/ui/Drawer";
import { IconButton } from "@/ui/IconButton";
import { Tooltip, TooltipProvider } from "@/ui/Tooltip";
import { Card, Specs } from "./Section";
import { ExampleRows } from "./StateMatrix";

const styles = stylex.create({
  term: {
    padding: 0,
    borderWidth: 0,
    backgroundColor: "transparent",
    color: colors.ink,
    cursor: "help",
    textDecorationLine: "underline",
    textDecorationStyle: "dotted",
    textUnderlineOffset: 3,
  },
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
export function TooltipExample() {
  return (
    <Card title="Tooltip">
      <TooltipProvider>
        <ExampleRows
          rows={[
            {
              name: "short",
              use: "IconButton label + key",
              example: (
                <Tooltip label="Step forward" shortcut="→">
                  <IconButton icon={StepForward} label="Step forward" variant="ghost" />
                </Tooltip>
              ),
            },
            {
              name: "rich",
              use: "Term definition",
              example: (
                <Tooltip label="Sort key" description="The column a list is ordered by.">
                  <button type="button" {...stylex.props(type.ui, styles.term)}>
                    sort key
                  </button>
                </Tooltip>
              ),
            },
          ]}
        />
      </TooltipProvider>
      <Specs
        rows={[
          ["Status", "Built: src/ui/Tooltip.tsx, Base UI Tooltip"],
          [
            "Props",
            "label · description (makes it the title + body kind) · shortcut · children: the trigger element",
          ],
          [
            "Box",
            "ink bg · paper text · radius 8 (6 short) · padding 10 × 12 (6 × 8) · max width 260",
          ],
          [
            "Text",
            "title type.control · body type.ui in lineStrong · short type.caption, key in type.number",
          ],
          ["Shadow", "0 6px 20px ink at 16%, only on floating things"],
          [
            "Timing",
            "opens after 400ms, instantly between tooltips (wrap the app in TooltipProvider) · fades and rises 4px over motion.press",
          ],
          ["Placement", "above, 6px from the trigger, flips when it runs out of room"],
        ]}
      />
    </Card>
  );
}

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

export function DrawerExample() {
  return (
    <Card title="Drawer">
      <ExampleRows
        rows={[
          {
            name: "menu",
            use: "Phone top bar",
            example: (
              <Drawer
                title="Menu"
                trigger={<IconButton icon={Menu} label="Open menu" variant="ghost" />}
              >
                <CollapsibleExampleList />
              </Drawer>
            ),
          },
          {
            name: "from a button",
            use: "Try it here",
            example: (
              <Drawer title="Lessons" trigger={<Button>Open drawer</Button>}>
                <CollapsibleExampleList />
              </Drawer>
            ),
          },
        ]}
      />
      <Specs
        rows={[
          ["Status", "Built: src/ui/Drawer.tsx, Base UI Drawer"],
          ["Props", "trigger: the element that opens it · title · children · open / onOpenChange"],
          [
            "Sheet",
            "surface · top corners radius.frame · max height 85% of the screen · grab handle 36 × 4 lineStrong",
          ],
          ["Backdrop", "ink at 40%, fading as you swipe"],
          [
            "Motion",
            "slides up over motion.move, motion.easeOut · swipe down, Escape or the backdrop closes it",
          ],
          ["Shadow", "the soft shadow, pointing up"],
        ]}
      />
    </Card>
  );
}

function CollapsibleExampleList() {
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
