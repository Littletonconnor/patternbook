import type { ReactNode } from "react";

import { palette } from "@/tokens/palette";

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
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div
          style={{
            width: 44,
            height: 44,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: `3px solid ${ink}`,
            borderRadius: 10,
            backgroundColor: paper,
          }}
        >
          <div style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: signal }} />
        </div>
        <div style={{ fontSize: 32 }}>Patternbook</div>
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
