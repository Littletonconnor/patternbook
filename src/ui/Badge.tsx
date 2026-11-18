import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";
import { colors, radius } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";

const styles = stylex.create({
  base: {
    display: "inline-flex",
    alignItems: "center",
    paddingTop: 3,
    paddingBottom: 1,
    paddingInline: 7,
    whiteSpace: "nowrap",
    borderRadius: radius.mark,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "transparent",
  },
});

const tones = stylex.create({
  neutral: { backgroundColor: colors.sunken, color: colors.inkSoft },
  read: { backgroundColor: colors.soundWash, color: colors.soundInk },
  new: { backgroundColor: colors.signalWash, color: colors.signalInk },
  kind: { backgroundColor: "transparent", borderColor: colors.lineStrong, color: colors.ink },
});

const levels = stylex.create({
  foundations: { backgroundColor: colors.ink, borderColor: colors.ink, color: colors.paper },
  core: { backgroundColor: colors.inkSoft, borderColor: colors.inkSoft, color: colors.paper },
  advanced: { backgroundColor: colors.surface, borderColor: colors.ink, color: colors.ink },
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
