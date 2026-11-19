import type { FigureKind } from "@/content/types";
import { FigureSketch } from "@/components/FigureSketch";

const bySlug: Record<string, FigureKind> = {
  "debounce-vs-throttle": "timeline",
  "optimistic-updates-and-rollback": "flow",
  "infinite-scroll-and-virtualization": "playground",
  "offset-vs-cursor-pagination": "race",
  "a-container-is-just-a-process": "structure",
};

export function Thumbnail({ slug }: { slug: string }) {
  return <FigureSketch kind={bySlug[slug] ?? "flow"} />;
}
