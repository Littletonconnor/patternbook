import * as stylex from "@stylexjs/stylex";
import { Callout } from "@/components/Callout";
import { CodeBlock } from "@/components/CodeBlock";
import { Footer } from "@/components/Footer";
import { LessonCard, LessonGrid } from "@/components/LessonCard";
import { LessonEnd } from "@/components/LessonEnd";
import { LessonHeader } from "@/components/LessonHeader";
import { PageRail } from "@/components/PageRail";
import { Pager } from "@/components/Pager";
import { Code, H2, Item, List, P, Prose, Strong } from "@/components/Prose";
import { ResourceList } from "@/components/ResourceList";
import { Sidebar } from "@/components/Sidebar";
import { Table } from "@/components/Table";
import { Term } from "@/components/Term";
import { TopBar } from "@/components/TopBar";
import { space } from "@/tokens/tokens.stylex";
import { Link } from "@/ui/Link";
import { TooltipProvider } from "@/ui/Tooltip";
import { sampleLesson, sampleTopics } from "./sample";
import { Card, Section, Specs } from "./Section";
import { Preview } from "./StateMatrix";

const styles = stylex.create({
  grid: { display: "flex", flexDirection: "column", gap: space.s4 },
  bleed: { marginInline: `calc(-1 * ${space.s6})`, marginBlock: `calc(-1 * ${space.s6})` },
  stack: { display: "flex", flexDirection: "column", gap: space.s3 },
  sidebar: { width: 268 },
});

const apis = sampleTopics[1];

export function PageParts() {
  return (
    <Section eyebrow="05 · Page parts · src/components" title="The furniture around a lesson">
      <TooltipProvider>
        <div {...stylex.props(styles.grid)}>
          <Card title="TopBar">
            <Preview>
              <div {...stylex.props(styles.bleed)}>
                <TopBar current="lessons" />
              </div>
            </Preview>
            <Specs
              rows={[
                [
                  "Props",
                  "current: lessons | diagrams | about · drawer: extra content for the phone drawer",
                ],
                ["Layout", "padding 12 × 24 · 1px line bottom border · paper · height 57"],
                [
                  "Brand",
                  "22 × 22 mark: 1.5px ink border, radius 5, lineStrong dot grid, one 7px signal dot · wordmark type.control at 600",
                ],
                [
                  "Search",
                  "32 high · surface · 1px line · inkMuted · Kbd ⌘K · opens a command menu later",
                ],
                [
                  "Phone",
                  "below 768px the nav becomes a ghost menu IconButton that opens the Drawer",
                ],
              ]}
            />
          </Card>

          <Card title="Sidebar">
            <Preview>
              <div {...stylex.props(styles.sidebar)}>
                <Sidebar topics={sampleTopics} currentSlug={sampleLesson.slug} />
              </div>
            </Preview>
            <Specs
              rows={[
                ["Props", "topics · currentSlug: its topic opens on load"],
                [
                  "Width",
                  "measure.sidebar + padding 20 12 24 16 · 1px line right border · the page layout makes it sticky",
                ],
                ["Order", "topics (Collapsible) · footer count"],
                ["Topics", "count shows lessons when closed, read/total when open"],
                [
                  "Rows",
                  "read: sound tick · current: line bg, 500 · hover: sunken · planned: inkMuted, Soon badge, not a link",
                ],
                [
                  "Read state",
                  "localStorage via useReadLessons, shared with LessonCard and Mark as read",
                ],
              ]}
            />
          </Card>

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
                [
                  "Meta",
                  "level Badge, minutes, diagrams, languages · type.number inkMuted · gap 8 × 16",
                ],
              ]}
            />
          </Card>

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
                [
                  "Box",
                  "surface · 1px line · radius.frame · padding 12 · the whole card is one link",
                ],
                [
                  "Thumbnail",
                  "140 high · sunken with a 16px dot grid · number and minutes top-left · Read badge bottom-right",
                ],
                ["Hover", "border lineStrong · title underlined"],
                ["Grid", "LessonGrid: auto-fill, min 260, gap 16"],
              ]}
            />
          </Card>

          <Card title="Prose, Term and Callout">
            <Preview>
              <div {...stylex.props(styles.stack)}>
                <Prose>
                  <H2 id="pp-position">A position is not a place</H2>
                  <P>
                    An offset says <Code>skip the first 4 rows</Code>. If a row is added at the top,
                    every row moves down one, and <Strong>row 4 appears again</Strong> on page two.
                    As long as the <Term id="sort-key">sort key</Term> is stable, use{" "}
                    <Code>WHERE id &lt; 9</Code> instead. The{" "}
                    <Link href="#pp-position">pagination primer</Link> has more.
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

          <Card title="PageRail">
            <Preview>
              <PageRail
                items={[
                  { id: "pp-position", label: "A position is not a place" },
                  { id: "pp-deep", label: "Deep pages get slow" },
                  { id: "pp-tradeoffs", label: "Trade-offs" },
                  { id: "pp-deeper", label: "Go deeper" },
                ]}
              />
            </Preview>
            <Specs
              rows={[
                ["Width", "measure.rail · sticky, 24 from the top · hidden below 1180px wide"],
                [
                  "Links",
                  "type.ui inkSoft · 10 left padding · 2px transparent left border · hover ink",
                ],
                [
                  "Active",
                  "ink, 500, 2px ink border · follows the heading nearest the top (IntersectionObserver)",
                ],
              ]}
            />
          </Card>

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

          <Card title="Pager">
            <Preview>
              <Pager previous={apis.lessons[1]} next={apis.lessons[3]} />
            </Preview>
            <Specs
              rows={[
                ["Layout", "two columns, gap 16 · stacks below 560px · Next is right-aligned"],
                [
                  "Card",
                  "surface · 1px line · radius.frame · padding 16 × 20 · hover border lineStrong",
                ],
                ["Ends", "pass only previous or next on the first and last lesson"],
              ]}
            />
          </Card>

          <Card title="Footer">
            <Preview>
              <Footer />
            </Preview>
            <Specs
              rows={[
                ["Text", "type.number inkMuted · links hover ink"],
                ["Layout", "1px line top border · padding-top 24 · wraps on small screens"],
              ]}
            />
          </Card>
        </div>
      </TooltipProvider>
    </Section>
  );
}
