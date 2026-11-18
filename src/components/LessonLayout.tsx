import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";
import { topics } from "@/content/catalog";
import { colors, measure, space } from "@/tokens/tokens.stylex";
import { Footer } from "./Footer";
import { PageRail, type RailItem } from "./PageRail";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

const WIDE = "@media (min-width: 768px)";
const TOP_BAR = "57px";
const RAIL = "@media (min-width: 1180px)";

const styles = stylex.create({
  page: { display: "flex", flexDirection: "column", minHeight: "100dvh" },
  columns: {
    flexGrow: 1,
    boxSizing: "border-box",
    width: "100%",
    maxWidth: measure.page,
    marginInline: "auto",
    display: "grid",
    gridTemplateColumns: {
      default: "minmax(0, 1fr)",
      [WIDE]: `calc(${measure.sidebar} + 28px) minmax(0, 1fr)`,
      [RAIL]: `calc(${measure.sidebar} + 28px) minmax(0, 1fr) ${measure.rail}`,
    },
    columnGap: { default: 0, [RAIL]: space.s8 },
  },
  sidebar: {
    display: { default: "none", [WIDE]: "block" },
    borderRightWidth: 1,
    borderRightStyle: "solid",
    borderRightColor: colors.line,
  },
  topBar: { position: "sticky", top: 0, zIndex: 10 },
  sidebarInner: {
    position: "sticky",
    top: TOP_BAR,
    height: `calc(100dvh - ${TOP_BAR})`,
  },
  main: {
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
    paddingTop: space.s12,
    paddingBottom: space.s8,
    paddingInline: { default: space.s4, [WIDE]: space.s12 },
  },
  container: {
    display: "flex",
    flexDirection: "column",
    gap: space.s12,
    width: "100%",
    maxWidth: measure.prose,
    flexGrow: 1,
  },
  content: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    gap: space.s12,
  },
  rail: { paddingTop: space.s12, paddingInlineEnd: space.s6 },
});

type LessonLayoutProps = {
  currentSlug?: string;
  rail?: readonly RailItem[];
  children: ReactNode;
};

export function LessonLayout({ rail = [], children }: LessonLayoutProps) {
  const sidebar = <Sidebar topics={topics} />;

  return (
    <div {...stylex.props(styles.page)}>
      <div {...stylex.props(styles.topBar)}>
        <TopBar current="lessons" drawer={sidebar} />
      </div>
      <div {...stylex.props(styles.columns)}>
        <div {...stylex.props(styles.sidebar)}>
          <div {...stylex.props(styles.sidebarInner)}>{sidebar}</div>
        </div>
        <main {...stylex.props(styles.main)}>
          <div {...stylex.props(styles.container)}>
            <div {...stylex.props(styles.content)}>{children}</div>
            <Footer />
          </div>
        </main>
        {rail.length > 0 && (
          <div {...stylex.props(styles.rail)}>
            <PageRail items={rail} />
          </div>
        )}
      </div>
    </div>
  );
}
