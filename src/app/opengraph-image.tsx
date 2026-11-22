import { ImageResponse } from "next/og";
import { lessons, topics, totals } from "@/content/catalog";
import { OgCard, ogSize } from "@/components/shell/OgCard";

export const alt = "Patternbook: short lessons on common software engineering problems";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  const hours = Math.round(totals().minutes / 60);
  return new ImageResponse(
    <OgCard
      eyebrow="Lessons with interactive diagrams"
      title="Interactive lessons on software engineering patterns"
      lede="Each lesson explains one problem and its fix, with a diagram you can change and step through."
      footer={
        <>
          <span>{topics.length} topics</span>
          <span>{lessons.length} lessons</span>
          <span>about {hours} hours</span>
        </>
      }
    />,
    size,
  );
}
