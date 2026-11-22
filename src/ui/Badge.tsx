import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";

import { colors, radius } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";

const styles = stylex.create({
  base: {
    borderColor: "transparent",
    borderRadius: radius.mark,
    borderStyle: "solid",
    borderWidth: 1,
    paddingInline: 7,
    alignItems: "center",
    display: "inline-flex",
    whiteSpace: "nowrap",
    paddingBottom: 1,
    paddingTop: 3,
  },
});

const tones = stylex.create({
  neutral: { backgroundColor: colors.sunken, color: colors.inkSoft },
  read: { backgroundColor: colors.soundWash, color: colors.soundInk },
  new: { backgroundColor: colors.signalWash, color: colors.signalInk },
  kind: { borderColor: colors.lineStrong, backgroundColor: "transparent", color: colors.ink },
});

const levels = stylex.create({
  foundations: { borderColor: colors.ink, backgroundColor: colors.ink, color: colors.paper },
  core: { borderColor: colors.inkSoft, backgroundColor: colors.inkSoft, color: colors.paper },
  advanced: { borderColor: colors.ink, backgroundColor: colors.surface, color: colors.ink },
});

export type Level = keyof typeof levels;

const levelNames: Record<Level, string> = {
  foundations: "Foundations",
  core: "Core",
  advanced: "Advanced",
};

type BadgeProps =
  | { tone?: keyof typeof tones; level?: never; children: ReactNode }
  | { level: Level; tone?: never; children?: ReactNode };

export function Badge({ tone = "neutral", level, children }: BadgeProps) {
  return (
    <span {...stylex.props(type.tag, styles.base, level ? levels[level] : tones[tone])}>
      {children ?? (level && levelNames[level])}
    </span>
  );
}
