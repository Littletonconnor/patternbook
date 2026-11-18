import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";
import { topics } from "@/content/catalog";
import { measure, space } from "@/tokens/tokens.stylex";
import { Footer } from "./Footer";
import { PageRail, type RailItem } from "./PageRail";
import { Sidebar } from "./Sidebar";
import { SidebarColumns } from "./SidebarColumns";
import { SidebarToggle } from "./SidebarToggle";
import { TopBar } from "./TopBar";

const WIDE = "@media (min-width: 768px)";
const RAIL = "@media (min-width: 1180px)";

const styles = stylex.create({
  page: { display: "flex", flexDirection: "column", minHeight: "100dvh" },
  topBar: { position: "sticky", top: 0, zIndex: 10 },
  main: {
    display: "grid",
    gridTemplateColumns: {
      default: "minmax(0, 1fr)",
      [RAIL]: `minmax(0, ${measure.lesson}) ${measure.rail}`,
    },
    justifyContent: "center",
    columnGap: space.s16,
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
    maxWidth: measure.lesson,
    containerType: "inline-size",
    marginInline: "auto",
  },
  content: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    gap: space.s12,
  },
  rail: { display: { default: "none", [RAIL]: "block" } },
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
        <TopBar current="lessons" drawer={sidebar} start={<SidebarToggle />} fluid />
      </div>
      <SidebarColumns sidebar={<Sidebar topics={topics} closable />}>
        <main {...stylex.props(styles.main)}>
          <div {...stylex.props(styles.container)}>
            <div {...stylex.props(styles.content)}>{children}</div>
            <Footer />
          </div>
          {rail.length > 0 && (
            <div {...stylex.props(styles.rail)}>
              <PageRail items={rail} />
            </div>
          )}
        </main>
      </SidebarColumns>
    </div>
  );
}
