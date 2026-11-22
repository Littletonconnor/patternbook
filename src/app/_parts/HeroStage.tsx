import * as stylex from "@stylexjs/stylex";
import type { RefObject } from "react";
import { colors, space } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";

const styles = stylex.create({
  stage: {
    paddingInline: space.s4,
    placeItems: "center",
    backgroundColor: colors.sunken,
    backgroundImage: `radial-gradient(${colors.lineStrong} 1px, transparent 1px)`,
    backgroundSize: "16px 16px",
    display: "grid",
    position: "relative",
    height: 220,
  },
  readout: {
    color: colors.inkMuted,
    fontVariantNumeric: "tabular-nums",
    position: "absolute",
    right: space.s4,
    top: space.s3,
  },
  svg: { overflow: "visible", display: "block", height: "auto", maxWidth: 440, width: "100%" },
  wire: { stroke: colors.ink, strokeWidth: 1.5 },
  node: { fill: colors.surface, stroke: colors.ink, strokeWidth: 1.5 },
  name: { fill: colors.ink, fontWeight: 500 },
  sub: { fill: colors.inkMuted },
  halo: { fill: colors.signal, opacity: 0.18 },
  dot: { fill: colors.signal },
});

const nodes = [
  { x: 0, name: "Client", sub: "browser" },
  { x: 172, name: "API", sub: "GET /posts" },
  { x: 344, name: "Database", sub: "posts" },
];

type HeroStageProps = {
  packet: RefObject<SVGGElement | null>;
  readout: RefObject<HTMLSpanElement | null>;
  startX: number;
  distance: number;
  roundTripMs: number;
};

export function HeroStage({ packet, readout, startX, distance, roundTripMs }: HeroStageProps) {
  return (
    <div {...stylex.props(styles.stage)}>
      <span ref={readout} aria-hidden="true" {...stylex.props(type.number, styles.readout)}>
        idle · t = 0.0 ms
      </span>
      <svg
        viewBox="-1 -1 442 54"
        role="img"
        aria-label={`A request travels from the client, through the API, to the database and back, about ${roundTripMs} ms round trip.`}
        {...stylex.props(styles.svg)}
      >
        <line x1={startX} y1={26} x2={startX + distance} y2={26} {...stylex.props(styles.wire)} />
        <g ref={packet}>
          <circle cx={startX} cy={26} r={10} {...stylex.props(styles.halo)} />
          <circle cx={startX} cy={26} r={6} {...stylex.props(styles.dot)} />
        </g>
        {nodes.map((node) => (
          <g key={node.name}>
            <rect x={node.x} y={0} width={96} height={52} rx={8} {...stylex.props(styles.node)} />
            <text
              x={node.x + 48}
              y={24}
              textAnchor="middle"
              {...stylex.props(type.ui, styles.name)}
            >
              {node.name}
            </text>
            <text
              x={node.x + 48}
              y={40}
              textAnchor="middle"
              {...stylex.props(type.tag, styles.sub)}
            >
              {node.sub}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
