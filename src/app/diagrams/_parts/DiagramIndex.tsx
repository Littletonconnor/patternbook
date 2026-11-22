"use client";

import * as stylex from "@stylexjs/stylex";
import { useState } from "react";

import { diagramKinds } from "@/content/diagrams";
import type { Diagram, DiagramKind, Lesson } from "@/content/types";
import { colors, space } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";
import { ToggleGroup } from "@/ui/ToggleGroup";

import { DiagramCard } from "./DiagramCard";

const styles = stylex.create({
  root: { gap: space.s6, display: "flex", flexDirection: "column" },
  filter: {
    marginInline: `calc(-1 * ${space.s4})`,
    paddingInline: space.s4,
    scrollbarWidth: "none",
    overflowX: "auto",
  },
  count: { color: colors.inkMuted, marginInlineStart: space.s2 },
  grid: {
    gap: space.s4,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(min(320px, 100%), 1fr))",
  },
});

type Entry = { diagram: Diagram; lesson: Pick<Lesson, "number" | "slug" | "title"> };

type Filter = "all" | DiagramKind;

function isDiagramKind(key: string): key is DiagramKind {
  return Object.hasOwn(diagramKinds, key);
}

export function DiagramIndex({ entries }: { entries: readonly Entry[] }) {
  const [filter, setFilter] = useState<Filter>("all");

  const kinds = Object.keys(diagramKinds)
    .filter(isDiagramKind)
    .filter((kind) => entries.some((entry) => entry.diagram.kind === kind));
  const options = [
    { value: "all" as const, label: "All", count: entries.length },
    ...kinds.map((kind) => ({
      value: kind,
      label: diagramKinds[kind],
      count: entries.filter((entry) => entry.diagram.kind === kind).length,
    })),
  ].map(({ value, label, count }) => ({
    value,
    label: (
      <>
        {label}
        <span {...stylex.props(type.number, styles.count)}>{count}</span>
      </>
    ),
  }));

  const shown = entries.filter((entry) => filter === "all" || entry.diagram.kind === filter);

  return (
    <div {...stylex.props(styles.root)}>
      <div {...stylex.props(styles.filter)}>
        <ToggleGroup
          aria-label="Filter by kind"
          options={options}
          value={filter}
          onValueChange={setFilter}
        />
      </div>
      <div {...stylex.props(styles.grid)}>
        {shown.map((entry) => (
          <DiagramCard key={entry.diagram.number} diagram={entry.diagram} lesson={entry.lesson} />
        ))}
      </div>
    </div>
  );
}
