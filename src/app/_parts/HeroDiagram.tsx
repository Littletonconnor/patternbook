"use client";

import * as stylex from "@stylexjs/stylex";
import { useState } from "react";

import { useRoundTrip } from "@/diagrams/useRoundTrip";
import { colors, radius, space } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";
import { Button } from "@/ui/Button";
import { Slider } from "@/ui/Slider";

import { HeroStage } from "./HeroStage";

const ONE_WAY_MS = 22;
const ROUND_TRIP_MS = ONE_WAY_MS * 2;
const START_X = 96;
const DISTANCE = 248;

const styles = stylex.create({
  diagram: {
    margin: 0,
    gap: space.s3,
    display: "flex",
    flexBasis: "420px",
    flexDirection: "column",
    flexGrow: "1",
    flexShrink: "1",
    maxWidth: 520,
    minWidth: 0,
  },
  frame: {
    borderColor: colors.line,
    borderRadius: radius.frame,
    borderStyle: "solid",
    borderWidth: 1,
    overflow: "hidden",
    backgroundColor: colors.surface,
    display: "flex",
    flexDirection: "column",
  },
  titleBar: {
    gap: space.s3,
    paddingInline: space.s4,
    alignItems: "center",
    boxSizing: "border-box",
    display: "flex",
    borderBottomColor: colors.line,
    borderBottomStyle: "solid",
    borderBottomWidth: 1,
    height: 46,
  },
  diagramLabel: { color: colors.inkMuted },
  controls: {
    gap: `${space.s3} ${space.s6}`,
    paddingBlock: space.s3,
    paddingInline: space.s4,
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    borderTopColor: colors.line,
    borderTopStyle: "solid",
    borderTopWidth: 1,
  },
  speed: { flexBasis: "160px", flexGrow: "1", flexShrink: "1", maxWidth: 220 },
  caption: { margin: 0, color: colors.inkSoft, textWrap: "pretty" },
  disclosure: { color: colors.inkMuted, marginInlineEnd: space.s2 },
});

function controlLabel(playing: boolean, started: boolean) {
  if (playing) {
    return "Pause";
  }
  return started ? "Resume" : "Send a request";
}

export function HeroDiagram() {
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [slowdown, setSlowdown] = useState(100);

  const { packet, readout } = useRoundTrip({
    playing,
    slowdown,
    oneWayMs: ONE_WAY_MS,
    distance: DISTANCE,
  });

  const toggle = () => {
    setStarted(true);
    setPlaying((p) => !p);
  };

  return (
    <figure {...stylex.props(styles.diagram)}>
      <div {...stylex.props(styles.frame)}>
        <div {...stylex.props(styles.titleBar)}>
          <span {...stylex.props(type.label, styles.diagramLabel)}>Diagram 0.1</span>
          <span {...stylex.props(type.control)}>One request, one round trip</span>
        </div>
        <HeroStage
          packet={packet}
          readout={readout}
          startX={START_X}
          distance={DISTANCE}
          roundTripMs={ROUND_TRIP_MS}
        />
        <div {...stylex.props(styles.controls)}>
          <Button variant="primary" onClick={toggle}>
            {controlLabel(playing, started)}
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
        Simplified timings, not a live request. Every lesson has an interactive diagram like this
        one: change the inputs and watch how the system responds.
      </figcaption>
    </figure>
  );
}
