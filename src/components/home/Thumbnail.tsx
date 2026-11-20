import type { DiagramKind } from "@/content/types";
import { DiagramSketch } from "@/components/DiagramSketch";

const bySlug: Record<string, DiagramKind> = {
  "debounce-vs-throttle": "timeline",
  "optimistic-updates-and-rollback": "flow",
  "infinite-scroll-and-virtualization": "playground",
  "offset-vs-cursor-pagination": "race",
  "a-container-is-just-a-process": "structure",
};

export function Thumbnail({ slug }: { slug: string }) {
  return <DiagramSketch kind={bySlug[slug] ?? "flow"} />;
}
