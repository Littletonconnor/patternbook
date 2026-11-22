import * as stylex from "@stylexjs/stylex";
import { Callout } from "@/components/lesson/Callout";
import { CodeBlock } from "@/components/lesson/CodeBlock";
import { LessonCard, LessonGrid } from "@/components/catalog/LessonCard";
import { LessonHeader } from "@/components/lesson/LessonHeader";
import { Code, H2, Item, List, P, Prose, Strong } from "@/components/lesson/Prose";
import { Term } from "@/components/lesson/Term";
import { space } from "@/tokens/tokens.stylex";
import { Link } from "@/ui/Link";
import { sampleLesson, sampleTopics } from "./sample";
import { Card, Specs } from "./Section";
import { Preview } from "./StateMatrix";

const apis = sampleTopics[1];

const styles = stylex.create({
  stack: { gap: space.s3, display: "flex", flexDirection: "column" },
});

export function LessonHeaderPart() {
  return (
    <Card title="LessonHeader">
      <Preview>
        <LessonHeader
          topic="APIs"
          lesson={{
            ...sampleLesson,
            title: "Offset vs cursor pagination",
            hook: "Why page two sometimes shows a row you already saw.",
          }}
          diagrams={2}
          languages={["SQL", "TypeScript"]}
        />
      </Preview>
      <Specs
        rows={[
          ["Width", "measure.prose · gap 16"],
          [
            "Text",
            "eyebrow type.label · title type.display, balanced · lede type.lede (new, 18/28) inkSoft",
          ],
          ["Meta", "level Badge, minutes, diagrams, languages · type.number inkMuted · gap 8 × 16"],
        ]}
      />
    </Card>
  );
}

export function LessonCardPart() {
  return (
    <Card title="LessonCard">
      <Preview>
        <LessonGrid>
          {apis.lessons.slice(1, 4).map((lesson) => (
            <LessonCard key={lesson.slug} lesson={lesson} />
          ))}
        </LessonGrid>
      </Preview>
      <Specs
        rows={[
          ["Props", "lesson · thumbnail: the diagram at rest (empty until the diagram kit)"],
          ["Box", "surface · 1px line · radius.frame · padding 12 · the whole card is one link"],
          [
            "Thumbnail",
            "140 high · sunken with a 16px dot grid · number and minutes top-left · Read badge bottom-right",
          ],
          ["Hover", "border lineStrong · title underlined"],
          ["Grid", "LessonGrid: auto-fill, min 260, gap 16"],
        ]}
      />
    </Card>
  );
}

export function ProsePart() {
  return (
    <Card title="Prose, Term and Callout">
      <Preview>
        <div {...stylex.props(styles.stack)}>
          <Prose>
            <H2 id="pp-position">A position is not a place</H2>
            <P>
              An offset says <Code>skip the first 4 rows</Code>. If a row is added at the top, every
              row moves down one, and <Strong>row 4 appears again</Strong> on page two. As long as
              the <Term id="sort-key">sort key</Term> is stable, use <Code>WHERE id &lt; 9</Code>{" "}
              instead. The <Link href="#pp-position">pagination primer</Link> has more.
            </P>
            <List>
              <Item>Positions shift when rows change.</Item>
              <Item>Values stay put.</Item>
            </List>
          </Prose>
          <Callout>Any unique, ordered column works as a cursor.</Callout>
          <Callout kind="pitfall">
            Sorting by a timestamp alone breaks when two rows share one.
          </Callout>
        </div>
      </Preview>
      <Specs
        rows={[
          [
            "Prose",
            "Prose, H2, H3, P, List, Item, Strong, Code, Breakout · measure.prose · type.body",
          ],
          [
            "Spacing",
            "h2 48 above, 12 below · paragraphs 16 apart · lists 20 indent, 4 between items",
          ],
          ["Code", "type.code on sunken · padding 1 × 5 · radius.mark"],
          [
            "Term",
            "dotted 1.5px inkMuted underline, ink on hover · Tooltip with the glossary entry · focusable",
          ],
          [
            "Callout",
            "note: sunken, inkSoft label · pitfall: faultWash, faultInk label · padding 14 × 16 · radius.control",
          ],
        ]}
      />
    </Card>
  );
}

export function CodeBlockPart() {
  return (
    <Card title="CodeBlock">
      <Preview>
        <CodeBlock
          samples={[
            {
              label: "SQL",
              lang: "sql",
              highlight: 2,
              code: "SELECT * FROM posts\nWHERE id < 11 -- the last id you saw\nORDER BY id DESC\nLIMIT 4;",
            },
            {
              label: "TypeScript",
              lang: "typescript",
              code: 'const page = await db.posts.findMany({\n  where: { id: { lt: cursor } },\n  orderBy: { id: "desc" },\n  take: 4,\n});',
            },
          ]}
        />
      </Preview>
      <Specs
        rows={[
          ["Props", "samples: { label, lang, code, highlight? }[]"],
          ["Box", "surface · 1px line · radius.control · scrolls sideways"],
          ["Header", "Tabs · Copy is a small ghost IconButton, shows a tick for 1.5s"],
          ["Code", "type.codeSmall · padding 12 · no line numbers"],
          ["Highlight", "one line in focusWash with a 3px focus left edge"],
          [
            "Syntax",
            "Shiki on the server · keywords focusInk · literals signalInk · comments inkMuted · rest ink",
          ],
        ]}
      />
    </Card>
  );
}
