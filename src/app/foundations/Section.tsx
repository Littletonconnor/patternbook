import type { ReactNode } from "react";
import * as stylex from "@stylexjs/stylex";
import { colors, measure, radius, space } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";

const styles = stylex.create({
  section: { gap: space.s6, display: "flex", flexDirection: "column" },
  header: { gap: space.s2, display: "flex", flexDirection: "column" },
  eyebrow: { color: colors.inkMuted },
  heading: { margin: 0 },
  note: { margin: 0, color: colors.inkSoft, maxWidth: measure.prose },
  card: {
    padding: space.s6,
    borderColor: colors.line,
    borderRadius: radius.frame,
    borderStyle: "solid",
    borderWidth: 1,
    gap: space.s4,
    backgroundColor: colors.surface,
    display: "flex",
    flexDirection: "column",
  },
  cardTitle: { fontWeight: 600 },
  token: { color: colors.inkMuted, letterSpacing: 0, textTransform: "none" },
  specs: { display: "flex", flexDirection: "column" },
  specRow: {
    gap: space.s3,
    paddingBlock: space.s2,
    display: "grid",
    gridTemplateColumns: "112px minmax(0, 1fr)",
    borderTopColor: colors.line,
    borderTopStyle: "solid",
    borderTopWidth: 1,
  },
  specKey: { color: colors.inkMuted, paddingTop: 2 },
  specValue: { color: colors.ink },
});

type SectionProps = {
  eyebrow: string;
  title: string;
  note?: string;
  children: ReactNode;
};

export function Section({ eyebrow, title, note, children }: SectionProps) {
  return (
    <section {...stylex.props(styles.section)}>
      <div {...stylex.props(styles.header)}>
        <div {...stylex.props(type.label, styles.eyebrow)}>{eyebrow}</div>
        <h2 {...stylex.props(type.heading, styles.heading)}>{title}</h2>
        {note && <p {...stylex.props(type.small, styles.note)}>{note}</p>}
      </div>
      {children}
    </section>
  );
}

export function Card({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div {...stylex.props(styles.card)}>
      {title && <div {...stylex.props(styles.cardTitle)}>{title}</div>}
      {children}
    </div>
  );
}

export function Token({ children }: { children: ReactNode }) {
  return <span {...stylex.props(type.label, styles.token)}>{children}</span>;
}

export function Specs({ rows }: { rows: [string, ReactNode][] }) {
  return (
    <div {...stylex.props(styles.specs)}>
      {rows.map(([name, value]) => (
        <div key={name} {...stylex.props(styles.specRow)}>
          <span {...stylex.props(type.number, styles.specKey)}>{name}</span>
          <span {...stylex.props(type.ui, styles.specValue)}>{value}</span>
        </div>
      ))}
    </div>
  );
}
