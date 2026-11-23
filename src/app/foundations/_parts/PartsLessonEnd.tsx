import { LessonEnd } from "@/components/lesson/LessonEnd";
import { Pager } from "@/components/lesson/Pager";
import { Table } from "@/components/lesson/Table";

import { ResourceList } from "./ResourceList";
import { sampleLesson, sampleTopics } from "./sample";
import { Card, Specs } from "./Section";
import { Preview } from "./StateMatrix";

const apis = sampleTopics[1];

export function TablePart() {
  return (
    <Card title="Table">
      <Preview>
        <Table
          caption="Offset versus cursor pagination"
          columns={["", "Offset", "Cursor"]}
          rows={[
            ["Jump to page 7", "Yes", "No"],
            ["Stable while rows change", "No", "Yes"],
            ["Cost of a deep page", "Grows with the offset", "Flat"],
          ]}
        />
      </Preview>
      <Specs
        rows={[
          ["Text", "type.small · header type.label inkMuted · first column inkSoft"],
          [
            "Cells",
            "padding 10 × 16 · 1px line between rows, none after the last · no vertical lines",
          ],
          ["Overflow", "scrolls sideways inside its own box below 520px"],
        ]}
      />
    </Card>
  );
}

export function ResourceListPart() {
  return (
    <Card title="ResourceList">
      <Preview>
        <ResourceList
          resources={[
            {
              kind: "Article",
              title: "We need tool support for keyset pagination",
              why: "The clearest case against OFFSET, with benchmarks.",
              href: "https://use-the-index-luke.com/no-offset",
            },
            {
              kind: "Docs",
              title: "Cursor-based pagination",
              why: "How a real API exposes cursors to clients.",
              href: "https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api",
            },
          ]}
        />
      </Preview>
      <Specs
        rows={[
          ["Box", "surface · 1px line · radius.frame · rows split by 1px line"],
          [
            "Row",
            "padding 16 × 18 · gap 20 · the whole row is one external link · stacks below 640px",
          ],
          [
            "Columns",
            "number and kind (type.labelSmall, 104 wide) · title + why · source (type.number) + arrow",
          ],
          ["Hover", "row bg paper · title underlined · arrow signal, nudges 2px up-right"],
        ]}
      />
    </Card>
  );
}

export function LessonEndPart() {
  return (
    <Card title="LessonEnd">
      <Preview>
        <LessonEnd slug={sampleLesson.slug} />
      </Preview>
      <Specs
        rows={[
          [
            "Mark as read",
            "Base UI Toggle styled as a secondary Button · pressed: soundWash, sound border, soundInk, ticked circle, “Read”",
          ],
          ["Saved", "localStorage, no account · ticks the sidebar row and the lesson card"],
          [
            "Feedback",
            "type.ui inkSoft prompt + two secondary Buttons · then “Thanks” in inkMuted",
          ],
        ]}
      />
    </Card>
  );
}

export function PagerPart() {
  return (
    <Card title="Pager">
      <Preview>
        <Pager previous={apis.lessons[1]} next={apis.lessons[3]} />
      </Preview>
      <Specs
        rows={[
          ["Layout", "two columns, gap 16 · stacks below 560px · Next is right-aligned"],
          [
            "Card",
            "surface · 1px line · radius.frame · padding 16 × 20 · hover border lineStrong, shadows.raised",
          ],
          ["Ends", "pass only previous or next on the first and last lesson"],
        ]}
      />
    </Card>
  );
}
