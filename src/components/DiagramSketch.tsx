import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";
import type { DiagramKind } from "@/content/types";
import { colors } from "@/tokens/tokens.stylex";

const styles = stylex.create({
  svg: { display: "block", overflow: "visible" },
  plain: { fill: colors.surface, stroke: colors.ink, strokeWidth: 1.5 },
  ghost: { fill: "none", stroke: colors.inkMuted, strokeWidth: 1.5, strokeDasharray: "4 3" },
  wire: { stroke: colors.ink, strokeWidth: 1.5 },
  divider: { stroke: colors.lineStrong, strokeWidth: 1.5, strokeDasharray: "4 3" },
  selected: { fill: colors.focusWash, stroke: colors.focus, strokeWidth: 1.5 },
  moving: { fill: colors.signalWash, stroke: colors.signal, strokeWidth: 1.5 },
  correct: { fill: colors.soundWash, stroke: colors.sound, strokeWidth: 1.5 },
  fault: { fill: colors.faultWash, stroke: colors.fault, strokeWidth: 1.5 },
  hatch: { stroke: colors.fault, strokeWidth: 1, opacity: 0.4 },
  event: { fill: colors.signal },
  fire: { fill: colors.ink },
});

function Svg({ width, height, children }: { width: number; height: number; children: ReactNode }) {
  return (
    <svg
      width={width * 0.72}
      height={height * 0.72}
      viewBox={`-1 -1 ${width + 2} ${height + 2}`}
      aria-hidden="true"
      {...stylex.props(styles.svg)}
    >
      {children}
    </svg>
  );
}

function Timeline() {
  const events = [12, 28, 40, 62, 150, 164, 180];
  return (
    <Svg width={260} height={72}>
      <line x1={0} y1={36} x2={260} y2={36} {...stylex.props(styles.wire)} />
      {events.map((x) => (
        <rect key={x} x={x} y={8} width={4} height={20} rx={2} {...stylex.props(styles.event)} />
      ))}
      {[112, 230].map((x) => (
        <rect key={x} x={x} y={44} width={4} height={20} rx={2} {...stylex.props(styles.fire)} />
      ))}
    </Svg>
  );
}

/** Optimistic updates: a change on its way through three steps. */
function Flow() {
  return (
    <Svg width={264} height={36}>
      <line x1={56} y1={18} x2={104} y2={18} {...stylex.props(styles.wire)} />
      <line x1={160} y1={18} x2={208} y2={18} {...stylex.props(styles.wire)} />
      {[0, 104, 208].map((x) => (
        <rect key={x} x={x} y={0} width={56} height={36} rx={8} {...stylex.props(styles.plain)} />
      ))}
      <circle cx={79} cy={18} r={5} {...stylex.props(styles.event)} />
    </Svg>
  );
}

/** Virtualization: only the rows in the window are real. */
function Playground() {
  return (
    <Svg width={172} height={88}>
      <rect x={6} y={0} width={160} height={16} rx={4} {...stylex.props(styles.plain)} />
      <rect x={0} y={20} width={172} height={48} rx={7} {...stylex.props(styles.selected)} />
      <rect x={6} y={26} width={160} height={16} rx={4} {...stylex.props(styles.plain)} />
      <rect x={6} y={46} width={160} height={16} rx={4} {...stylex.props(styles.plain)} />
      <rect x={6} y={72} width={160} height={16} rx={4} {...stylex.props(styles.ghost)} />
    </Svg>
  );
}

/** Offset vs cursor: one page repeats a row, the other doesn't. */
function Race() {
  const rows = [0, 20, 40, 60];
  return (
    <Svg width={240} height={76}>
      <defs>
        <clipPath id="pb-thumb-fault">
          <rect x={0} y={20} width={96} height={16} rx={4} />
        </clipPath>
      </defs>
      {rows.map((y) => (
        <rect
          key={y}
          x={0}
          y={y}
          width={96}
          height={16}
          rx={4}
          {...stylex.props(y === 20 ? styles.fault : styles.plain)}
        />
      ))}
      <g clipPath="url(#pb-thumb-fault)">
        {Array.from({ length: 16 }, (_, i) => (
          <line
            key={i}
            x1={i * 8 - 16}
            y1={36}
            x2={i * 8}
            y2={20}
            {...stylex.props(styles.hatch)}
          />
        ))}
      </g>
      <line x1={120} y1={-6} x2={120} y2={82} {...stylex.props(styles.divider)} />
      {rows.map((y) => (
        <rect
          key={y}
          x={144}
          y={y}
          width={96}
          height={16}
          rx={4}
          {...stylex.props(y === 20 ? styles.correct : styles.plain)}
        />
      ))}
    </Svg>
  );
}

/** A container is just a process: layers, with one being written. */
function Structure() {
  return (
    <Svg width={200} height={84}>
      <rect x={0} y={0} width={200} height={18} rx={4} {...stylex.props(styles.ghost)} />
      <rect x={0} y={22} width={200} height={18} rx={4} {...stylex.props(styles.moving)} />
      <rect x={0} y={44} width={200} height={18} rx={4} {...stylex.props(styles.plain)} />
      <rect x={0} y={66} width={200} height={18} rx={4} {...stylex.props(styles.plain)} />
    </Svg>
  );
}

function Meter() {
  const bars = [18, 26, 22, 48, 72];

  return (
    <Svg width={148} height={80}>
      {bars.map((height, i) => (
        <rect
          key={i}
          x={8 + i * 28}
          y={80 - height}
          width={20}
          height={height}
          rx={2}
          {...stylex.props(i === bars.length - 1 ? styles.event : styles.fire)}
        />
      ))}
      <line x1={0} y1={80} x2={148} y2={80} {...stylex.props(styles.wire)} />
    </Svg>
  );
}

const byKind: Record<DiagramKind, () => ReactNode> = {
  playground: Playground,
  race: Race,
  timeline: Timeline,
  flow: Flow,
  structure: Structure,
  meter: Meter,
};

export function DiagramSketch({ kind }: { kind: DiagramKind }) {
  const Sketch = byKind[kind];
  return <Sketch />;
}
