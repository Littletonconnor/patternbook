"use client";

import * as stylex from "@stylexjs/stylex";
import { useEffect, useRef, useState } from "react";
import { colors, radius, space } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";
import { Button } from "@/ui/Button";
import { Slider } from "@/ui/Slider";

const ONE_WAY_MS = 22;
const ROUND_TRIP_MS = ONE_WAY_MS * 2;
const START_X = 96;
const DISTANCE = 248;

const easeInOut = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2);

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
    position: "relative",
    display: "grid",
    placeItems: "center",
    height: 220,
    paddingInline: space.s4,
    backgroundColor: colors.sunken,
    backgroundImage: `radial-gradient(${colors.lineStrong} 1px, transparent 1px)`,
    backgroundSize: "16px 16px",
  },
  readout: {
    position: "absolute",
    top: space.s3,
    right: space.s4,
    color: colors.inkMuted,
    fontVariantNumeric: "tabular-nums",
  },
  svg: { display: "block", width: "100%", maxWidth: 440, height: "auto", overflow: "visible" },
  wire: { stroke: colors.ink, strokeWidth: 1.5 },
  node: { fill: colors.surface, stroke: colors.ink, strokeWidth: 1.5 },
  name: { fill: colors.ink, fontWeight: 500 },
  sub: { fill: colors.inkMuted },
  halo: { fill: colors.signal, opacity: 0.18 },
  dot: { fill: colors.signal },
  controls: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: `${space.s3} ${space.s6}`,
    paddingBlock: space.s3,
    paddingInline: space.s4,
    borderTopWidth: 1,
    borderTopStyle: "solid",
    borderTopColor: colors.line,
  },
  speed: { flex: "1 1 160px", maxWidth: 220 },
  caption: { margin: 0, color: colors.inkSoft, textWrap: "pretty" },
  disclosure: { color: colors.inkMuted, marginInlineEnd: space.s2 },
});

const nodes = [
  { x: 0, name: "Client", sub: "browser" },
  { x: 172, name: "API", sub: "GET /posts" },
  { x: 344, name: "Database", sub: "posts" },
];

export function HeroFigure() {
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [slowdown, setSlowdown] = useState(100);

  const packet = useRef<SVGGElement>(null);
  const readout = useRef<HTMLSpanElement>(null);
  const simulated = useRef(0);
  const slowdownRef = useRef(slowdown);

  useEffect(() => {
    slowdownRef.current = slowdown;
  }, [slowdown]);

  useEffect(() => {
    if (!playing) return;
    let frame = 0;
    let last = performance.now();

    const tick = (now: number) => {
      simulated.current += (now - last) / slowdownRef.current;
      last = now;

      const t = simulated.current % ROUND_TRIP_MS;
      const outbound = t < ONE_WAY_MS;
      const progress = outbound ? t / ONE_WAY_MS : 2 - t / ONE_WAY_MS;
      packet.current?.setAttribute(
        "transform",
        `translate(${(easeInOut(progress) * DISTANCE).toFixed(2)} 0)`,
      );
      if (readout.current) {
        readout.current.textContent = `${outbound ? "request" : "response"} · t = ${t.toFixed(1)} ms`;
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing]);

  const toggle = () => {
    setStarted(true);
    setPlaying((p) => !p);
  };

  return (
    <figure {...stylex.props(styles.figure)}>
      <div {...stylex.props(styles.frame)}>
        <div {...stylex.props(styles.titleBar)}>
          <span {...stylex.props(type.label, styles.fig)}>Fig 0.1</span>
          <span {...stylex.props(type.control)}>One request, one round trip</span>
        </div>
        <div {...stylex.props(styles.stage)}>
          <span ref={readout} aria-hidden="true" {...stylex.props(type.number, styles.readout)}>
            idle · t = 0.0 ms
          </span>
          <svg
            viewBox="-1 -1 442 54"
            role="img"
            aria-label={`A request travels from the client, through the API, to the database and back, about ${ROUND_TRIP_MS} ms round trip.`}
            {...stylex.props(styles.svg)}
          >
            <line
              x1={START_X}
              y1={26}
              x2={START_X + DISTANCE}
              y2={26}
              {...stylex.props(styles.wire)}
            />
            <g ref={packet}>
              <circle cx={START_X} cy={26} r={10} {...stylex.props(styles.halo)} />
              <circle cx={START_X} cy={26} r={6} {...stylex.props(styles.dot)} />
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
          <Button variant="primary" onClick={toggle}>
            {playing ? "Pause" : started ? "Resume" : "Send a request"}
          </Button>
          <div {...stylex.props(styles.speed)}>
            <Slider
              label="Slow motion"
              value={slowdown}
              onValueChange={(value) => setSlowdown(value)}
              min={1}
              max={100}
              step={1}
              renderValue={(value) => (value === 1 ? "real time" : `${value}×`)}
            />
          </div>
        </div>
      </div>
      <figcaption {...stylex.props(type.small, styles.caption)}>
        <span {...stylex.props(type.labelSmall, styles.disclosure)}>Illustrative</span>
        Simplified timings, not a live request. Every lesson is built around an interactive figure
        like this one: change the inputs and watch the system respond.
      </figcaption>
    </figure>
  );
}
