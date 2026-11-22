import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";

import { colors, space } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";

const styles = stylex.create({
  scroll: { overflowX: "auto" },
  table: { borderCollapse: "collapse", minWidth: 520, width: "100%" },
  cell: {
    paddingBlock: 10,
    paddingInline: space.s4,
    textAlign: "start",
    verticalAlign: "top",
    borderBottomColor: colors.line,
    borderBottomStyle: "solid",
    borderBottomWidth: 1,
  },
  head: { color: colors.inkMuted },
  first: { color: colors.inkSoft, fontWeight: 400 },
  hidden: {
    overflow: "hidden",
    clipPath: "inset(50%)",
    position: "absolute",
    whiteSpace: "nowrap",
    height: 1,
    width: 1,
  },
  last: { borderBottomWidth: 0 },
});

type TableProps = {
  columns: readonly ReactNode[];
  rows: readonly (readonly ReactNode[])[];
  caption?: string;
};

export function Table({ columns, rows, caption }: TableProps) {
  return (
    <div {...stylex.props(styles.scroll)}>
      <table {...stylex.props(type.small, styles.table)}>
        {caption && <caption {...stylex.props(styles.hidden)}>{caption}</caption>}
        <thead>
          <tr>
            {columns.map((column, i) => (
              <th key={i} scope="col" {...stylex.props(type.label, styles.cell, styles.head)}>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) => (
            <tr key={r}>
              {row.map((cell, c) => {
                const props = stylex.props(
                  styles.cell,
                  c === 0 && styles.first,
                  r === rows.length - 1 && styles.last,
                );
                return c === 0 ? (
                  <th key={c} scope="row" {...props}>
                    {cell}
                  </th>
                ) : (
                  <td key={c} {...props}>
                    {cell}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
