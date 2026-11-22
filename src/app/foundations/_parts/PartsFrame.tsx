import * as stylex from "@stylexjs/stylex";

import { PageRail } from "@/components/lesson/PageRail";
import { Footer } from "@/components/shell/Footer";
import { Sidebar } from "@/components/shell/Sidebar";
import { TopBar } from "@/components/shell/TopBar";
import { space } from "@/tokens/tokens.stylex";

import { sampleLesson, sampleTopics } from "./sample";
import { Card, Specs } from "./Section";
import { Preview } from "./StateMatrix";

const styles = stylex.create({
  bleed: { marginBlock: `calc(-1 * ${space.s6})`, marginInline: `calc(-1 * ${space.s6})` },
  sidebar: { width: 268 },
});

export function TopBarPart() {
  return (
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
          ["Phone", "below 768px the nav becomes a ghost menu IconButton that opens the Drawer"],
        ]}
      />
    </Card>
  );
}

export function SidebarPart() {
  return (
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
  );
}

export function PageRailPart() {
  return (
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
          ["Links", "type.ui inkSoft · 10 left padding · 2px transparent left border · hover ink"],
          [
            "Active",
            "ink, 500, 2px ink border · follows the heading nearest the top (IntersectionObserver)",
          ],
        ]}
      />
    </Card>
  );
}

export function FooterPart() {
  return (
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
  );
}
