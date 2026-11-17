import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";
import { colors } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";

const styles = stylex.create({
  scroll: { overflowX: "auto" },
  table: { width: "100%", minWidth: 520, borderCollapse: "collapse" },
  cell: {
    paddingBlock: 10,
    paddingInline: 16,
    textAlign: "start",
    verticalAlign: "top",
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: colors.line,
  },
  head: { color: colors.inkMuted },
  first: { color: colors.inkSoft, fontWeight: 400 },
  hidden: {
    position: "absolute",
    width: 1,
    height: 1,
    overflow: "hidden",
    clipPath: "inset(50%)",
    whiteSpace: "nowrap",
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
