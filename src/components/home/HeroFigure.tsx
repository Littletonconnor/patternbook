"use client";

import * as stylex from "@stylexjs/stylex";
import { useState } from "react";
import { colors, motion, radius, space } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";
import { Button } from "@/ui/Button";

const travel = stylex.keyframes({
  from: { transform: "translateX(0)" },
  to: { transform: "translateX(248px)" },
});

const styles = stylex.create({
  figure: {
    flex: "1 1 420px",
    minWidth: 0,
    maxWidth: 520,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: space.s3,
  },
  frame: {
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors.line,
    borderRadius: radius.frame,
  },
  titleBar: {
    display: "flex",
    alignItems: "center",
    gap: space.s3,
    boxSizing: "border-box",
    height: 46,
    paddingInline: space.s4,
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: colors.line,
  },
  fig: { color: colors.inkMuted },
  stage: {
    display: "grid",
    placeItems: "center",
    height: 220,
    paddingInline: space.s4,
    backgroundColor: colors.sunken,
    backgroundImage: `radial-gradient(${colors.lineStrong} 1px, transparent 1px)`,
    backgroundSize: "16px 16px",
  },
  svg: { display: "block", width: "100%", maxWidth: 440, height: "auto", overflow: "visible" },
  wire: { stroke: colors.ink, strokeWidth: 1.5 },
  node: { fill: colors.surface, stroke: colors.ink, strokeWidth: 1.5 },
  name: { fill: colors.ink, fontWeight: 500 },
  sub: { fill: colors.inkMuted },
  packet: {
    animationName: { default: travel, "@media (prefers-reduced-motion: reduce)": "none" },
    animationDuration: "2.2s",
    animationTimingFunction: motion.easeInOut,
    animationIterationCount: "infinite",
    animationDirection: "alternate",
  },
  halo: { fill: colors.signal, opacity: 0.18 },
  dot: { fill: colors.signal },
  controls: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: space.s3,
    paddingBlock: 10,
    paddingInline: space.s4,
    borderTopWidth: 1,
    borderTopStyle: "solid",
    borderTopColor: colors.line,
  },
  note: { color: colors.inkMuted },
  caption: { margin: 0, color: colors.inkSoft },
});

const playState = stylex.create({
  running: { animationPlayState: "running" },
  paused: { animationPlayState: "paused" },
});

const nodes = [
  { x: 0, name: "Client", sub: "browser" },
  { x: 172, name: "API", sub: "GET /posts" },
  { x: 344, name: "Database", sub: "posts" },
];

export function HeroFigure() {
  const [playing, setPlaying] = useState(false);

  return (
    <figure {...stylex.props(styles.figure)}>
      <div {...stylex.props(styles.frame)}>
        <div {...stylex.props(styles.titleBar)}>
          <span {...stylex.props(type.label, styles.fig)}>Fig 0.1</span>
          <span {...stylex.props(type.control)}>A request, there and back</span>
        </div>
        <div {...stylex.props(styles.stage)}>
          <svg
            viewBox="-1 -1 442 54"
            role="img"
            aria-label="A request travels from the client, through the API, to the database and back."
            {...stylex.props(styles.svg)}
          >
            <line x1={96} y1={26} x2={344} y2={26} {...stylex.props(styles.wire)} />
            <g {...stylex.props(styles.packet, playing ? playState.running : playState.paused)}>
              <circle cx={96} cy={26} r={10} {...stylex.props(styles.halo)} />
              <circle cx={96} cy={26} r={6} {...stylex.props(styles.dot)} />
            </g>
            {nodes.map((node) => (
              <g key={node.name}>
                <rect
                  x={node.x}
                  y={0}
                  width={96}
                  height={52}
                  rx={8}
                  {...stylex.props(styles.node)}
                />
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
        <div {...stylex.props(styles.controls)}>
          <Button variant="primary" onClick={() => setPlaying((p) => !p)}>
            {playing ? "Pause" : "Send a request"}
          </Button>
          <span {...stylex.props(type.tag, styles.note)}>time slowed 100×</span>
        </div>
      </div>
      <figcaption {...stylex.props(type.small, styles.caption)}>
        Every lesson has figures like this one. Nothing moves until you ask it to.
      </figcaption>
    </figure>
  );
}
