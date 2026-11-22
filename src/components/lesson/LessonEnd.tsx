"use client";

import * as stylex from "@stylexjs/stylex";
import { Circle, CircleCheck } from "lucide-react";
import { useState } from "react";
import { colors, space } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";
import { Button } from "@/ui/Button";
import { Icon } from "@/ui/Icon";
import { Toggle } from "@/ui/Toggle";
import { useReadLessons } from "@/hooks/useReadLessons";

const styles = stylex.create({
  end: {
    gap: space.s4,
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  feedback: { gap: space.s3, alignItems: "center", display: "flex", flexWrap: "wrap" },
  prompt: { color: colors.inkSoft },
  thanks: { color: colors.inkMuted },
});

export function MarkAsRead({ slug }: { slug: string }) {
  const { read, setRead } = useReadLessons();
  const isRead = read.has(slug);
  return (
    <Toggle pressed={isRead} onPressedChange={(pressed) => setRead(slug, pressed)}>
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
