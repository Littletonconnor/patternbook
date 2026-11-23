import type { ReactNode } from "react";

import { palette } from "@/tokens/palette";

import { markDotRadius, markDots, markSignal, markViewBox } from "./markShape";

export const ogSize = { width: 1200, height: 630 };

const { paper, ink, inkSoft, inkMuted, lineStrong, signal } = palette;

type OgCardProps = {
  eyebrow: string;
  title: string;
  lede: string;
  footer?: ReactNode;
};

export function OgCard({ eyebrow, title, lede, footer }: OgCardProps) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        backgroundColor: paper,
        backgroundImage: `radial-gradient(${lineStrong} 1.5px, transparent 1.5px)`,
        backgroundSize: "28px 28px",
        color: ink,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <svg width={40} height={40} viewBox={markViewBox}>
          {markDots.map(({ cx, cy }) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={markDotRadius} fill={ink} />
          ))}
          <circle {...markSignal} fill={signal} />
        </svg>
        <div style={{ fontSize: 32, letterSpacing: "-0.035em" }}>patternbook</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 960 }}>
        <div style={{ fontSize: 24, letterSpacing: "0.06em", color: inkMuted }}>
          {eyebrow.toUpperCase()}
        </div>
        <div style={{ fontSize: 72, lineHeight: 1.05, letterSpacing: "-0.03em" }}>{title}</div>
        <div style={{ fontSize: 32, lineHeight: 1.35, color: inkSoft }}>{lede}</div>
      </div>
      <div style={{ display: "flex", gap: 32, fontSize: 24, color: inkMuted }}>{footer}</div>
    </div>
  );
}
