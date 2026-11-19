import { lessonBySlug } from "./catalog";
import type { Figure, FigureKind } from "./types";

export const figureKinds: Record<FigureKind, string> = {
  playground: "Playground",
  race: "Race",
  timeline: "Timeline",
  flow: "Flow",
  structure: "Structure",
  meter: "Meter",
};

export const figures: Figure[] = [
  {
    number: "1.1",
    kind: "flow",
    title: "From keypress to pixels",
    lesson: "what-happens-when-you-type-a-url",
  },
  {
    number: "8.1",
    kind: "structure",
    title: "One process becomes two",
    lesson: "processes-fork-and-exec",
  },
  {
    number: "25.1",
    kind: "timeline",
    title: "Keystrokes in, calls out",
    lesson: "debounce-vs-throttle",
  },
  {
    number: "27.1",
    kind: "flow",
    title: "Pretend it worked, then find out",
    lesson: "optimistic-updates-and-rollback",
  },
  {
    number: "28.1",
    kind: "playground",
    title: "Only render what is on screen",
    lesson: "infinite-scroll-and-virtualization",
  },
  {
    number: "33.1",
    kind: "race",
    title: "Paging a list that keeps changing",
    lesson: "offset-vs-cursor-pagination",
  },
  {
    number: "33.2",
    kind: "meter",
    title: "Rows read to serve one page",
    lesson: "offset-vs-cursor-pagination",
  },
  {
    number: "62.1",
    kind: "timeline",
    title: "Retrying without a stampede",
    lesson: "retries-with-backoff-and-jitter",
  },
  {
    number: "74.1",
    kind: "structure",
    title: "Change a line, rebuild the layers",
    lesson: "image-layers-and-the-build-cache",
  },
];

export function figureLesson(figure: Figure) {
  const lesson = lessonBySlug(figure.lesson);
  if (!lesson)
    throw new Error(`Figure ${figure.number} points at a missing lesson: ${figure.lesson}`);
  return lesson;
}
