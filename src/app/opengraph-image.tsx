import { ImageResponse } from "next/og";
import { lessons, topics, totals } from "@/content/catalog";
import { OgCard, ogSize } from "./ogImage";

export const alt = "Patternbook: an interactive notebook of everyday engineering problems";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  const hours = Math.round(totals().minutes / 60);
  return new ImageResponse(
    <OgCard
      eyebrow="An interactive engineering notebook"
      title="Learn the pattern by breaking it first."
      lede="Short lessons on the problems every engineer runs into, each built around a figure you operate yourself."
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
