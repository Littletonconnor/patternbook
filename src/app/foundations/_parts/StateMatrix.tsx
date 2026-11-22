import * as stylex from "@stylexjs/stylex";
import { Fragment } from "react";
import type { ReactNode } from "react";

import { colors, radius, space } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";

import { Token } from "./Section";

export const previewStates = ["rest", "hover", "pressed", "focus", "disabled"] as const;
export type PreviewState = (typeof previewStates)[number];

export function previewProps(state: PreviewState) {
  if (state === "rest") {
    return {};
  }
  if (state === "disabled") {
    return { disabled: true };
  }
  return { "data-preview": state };
}

const styles = stylex.create({
  panel: {
    padding: space.s6,
    borderColor: colors.line,
    borderRadius: radius.control,
    borderStyle: "solid",
    borderWidth: 1,
    gap: `${space.s4} ${space.s3}`,
    alignItems: "center",
    backgroundColor: colors.paper,
    display: "grid",
    overflowX: "auto",
  },
  columns: (count: number) => ({
    gridTemplateColumns: `160px repeat(${count}, minmax(0, 1fr))`,
  }),
  muted: { color: colors.inkMuted },
  rowLabel: { display: "flex", flexDirection: "column" },
  example: { gap: space.s3, alignItems: "center", display: "flex", flexWrap: "wrap" },
  preview: { display: "block" },
});

type Row = { name: string; use?: string };

function RowLabel({ row }: { row: Row }) {
  return (
    <span {...stylex.props(styles.rowLabel)}>
      <Token>{row.name}</Token>
      {row.use && <span {...stylex.props(type.small, styles.muted)}>{row.use}</span>}
    </span>
  );
}

export function StateMatrix<R extends Row>({
  rows,
  render,
  states = previewStates,
}: {
  rows: readonly R[];
  render: (row: R, state: PreviewState) => ReactNode;
  states?: readonly PreviewState[];
}) {
  return (
    <div {...stylex.props(styles.panel, styles.columns(states.length))}>
      <span />
      {states.map((state) => (
        <span key={state} {...stylex.props(type.label, styles.muted)}>
          {state}
        </span>
      ))}
      {rows.map((row) => (
        <Fragment key={row.name + (row.use ?? "")}>
          <RowLabel row={row} />
          {states.map((state) => (
            <span key={state}>{render(row, state)}</span>
          ))}
        </Fragment>
      ))}
    </div>
  );
}

export function ExampleRows({ rows }: { rows: readonly (Row & { example: ReactNode })[] }) {
  return (
    <div {...stylex.props(styles.panel, styles.columns(1))}>
      {rows.map((row) => (
        <Fragment key={row.name + (row.use ?? "")}>
          <RowLabel row={row} />
          <div {...stylex.props(styles.example)}>{row.example}</div>
        </Fragment>
      ))}
    </div>
  );
}

export function Preview({ children }: { children: ReactNode }) {
  return <div {...stylex.props(styles.panel, styles.preview)}>{children}</div>;
}
