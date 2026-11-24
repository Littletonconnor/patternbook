import type { LessonSlug } from "@/content/catalog";
import type { DiagramKind } from "@/content/types";

import { DiagramSketch } from "./DiagramSketch";

const bySlug: Partial<Record<LessonSlug, DiagramKind>> = {
  "debounce-vs-throttle": "timeline",
  "optimistic-updates-and-rollback": "flow",
  "infinite-scroll-and-virtualization": "playground",
  "offset-vs-cursor-pagination": "race",
  "a-container-is-just-a-process": "structure",
};

export function Thumbnail({ slug }: { slug: LessonSlug }) {
  return <DiagramSketch kind={bySlug[slug] ?? "flow"} />;
}
