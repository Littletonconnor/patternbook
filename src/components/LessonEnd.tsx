"use client";

import { Toggle } from "@base-ui/react/toggle";
import * as stylex from "@stylexjs/stylex";
import { Circle, CircleCheck } from "lucide-react";
import { useState } from "react";
import { colors, space } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";
import { Button, buttonStyles } from "@/ui/Button";
import { Icon } from "@/ui/Icon";
import { useReadLessons } from "./readState";

const PRESSED = ":is([data-pressed])";
const HOVER = "@media (hover: hover)";

const styles = stylex.create({
  end: {
    gap: space.s4,
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  read: {
    borderColor: { [PRESSED]: colors.sound, default: colors.lineStrong },
    backgroundColor: {
      [PRESSED]: colors.soundWash,
      default: colors.surface,
      ":hover": { [HOVER]: colors.sunken, default: null },
    },
    color: { [PRESSED]: colors.soundInk, default: colors.ink },
  },
  feedback: { gap: space.s3, alignItems: "center", display: "flex", flexWrap: "wrap" },
  prompt: { color: colors.inkSoft },
  thanks: { color: colors.inkMuted },
});

export function MarkAsRead({ slug }: { slug: string }) {
  const { read, setRead } = useReadLessons();
  const isRead = read.has(slug);
  return (
    <Toggle
      pressed={isRead}
      onPressedChange={(pressed) => setRead(slug, pressed)}
      {...stylex.props(type.control, buttonStyles.base, styles.read)}
    >
      <Icon icon={isRead ? CircleCheck : Circle} />
      {isRead ? "Read" : "Mark as read"}
    </Toggle>
  );
}

export function Feedback() {
  const [answered, setAnswered] = useState(false);
  if (answered) {
    return <span {...stylex.props(type.ui, styles.thanks)}>Thanks</span>;
  }
  return (
    <div {...stylex.props(styles.feedback)}>
      <span {...stylex.props(type.ui, styles.prompt)}>Was this lesson useful?</span>
      <Button onClick={() => setAnswered(true)}>Yes</Button>
      <Button onClick={() => setAnswered(true)}>Not quite</Button>
    </div>
  );
}

export function LessonEnd({ slug }: { slug: string }) {
  return (
    <div {...stylex.props(styles.end)}>
      <MarkAsRead slug={slug} />
      <Feedback />
    </div>
  );
}
