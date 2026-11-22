"use client";

import { useEffect, useRef } from "react";

const easeInOut = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2);

type RoundTrip = {
  playing: boolean;
  slowdown: number;
  oneWayMs: number;
  distance: number;
};

export function useRoundTrip({ playing, slowdown, oneWayMs, distance }: RoundTrip) {
  const packet = useRef<SVGGElement>(null);
  const readout = useRef<HTMLSpanElement>(null);
  const simulated = useRef(0);
  const slowdownRef = useRef(slowdown);

  useEffect(() => {
    slowdownRef.current = slowdown;
  }, [slowdown]);

  useEffect(() => {
    if (!playing) {
      return;
    }
    const roundTripMs = oneWayMs * 2;
    let frame = 0;
    let last = performance.now();

    const tick = (now: number) => {
      simulated.current += (now - last) / slowdownRef.current;
      last = now;

      const t = simulated.current % roundTripMs;
      const outbound = t < oneWayMs;
      const progress = outbound ? t / oneWayMs : 2 - t / oneWayMs;
      packet.current?.setAttribute(
        "transform",
        `translate(${(easeInOut(progress) * distance).toFixed(2)} 0)`,
      );
      if (readout.current) {
        readout.current.textContent = `${outbound ? "request" : "response"} · t = ${t.toFixed(1)} ms`;
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, oneWayMs, distance]);

  return { packet, readout };
}
