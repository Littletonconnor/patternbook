import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";
import { topics } from "@/content/catalog";
import { measure, space } from "@/tokens/tokens.stylex";
import { Footer } from "@/components/shell/Footer";
import { PageRail } from "@/components/lesson/PageRail";
import type { RailItem } from "@/components/lesson/PageRail";
import { Sidebar } from "@/components/shell/Sidebar";
import { SidebarColumns } from "./SidebarColumns";
import { SidebarToggle } from "./SidebarToggle";
import { TopBar } from "@/components/shell/TopBar";

const WIDE = "@media (min-width: 768px)";
const RAIL = "@media (min-width: 1180px)";

const styles = stylex.create({
  page: { display: "flex", flexDirection: "column", minHeight: "100dvh" },
  topBar: { position: "sticky", zIndex: 10, top: 0 },
  main: {
    paddingInline: { [WIDE]: space.s12, default: space.s4 },
    columnGap: space.s16,
    display: "grid",
    gridTemplateColumns: {
      [RAIL]: `minmax(0, ${measure.lesson}) ${measure.rail}`,
      default: "minmax(0, 1fr)",
    },
    justifyContent: "center",
    minWidth: 0,
    paddingBottom: space.s8,
    paddingTop: space.s12,
  },
  container: {
    gap: space.s12,
    marginInline: "auto",
    containerType: "inline-size",
    display: "flex",
    flexDirection: "column",
    maxWidth: measure.lesson,
    width: "100%",
  },
  content: {
    gap: space.s12,
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
  },
  rail: { display: { [RAIL]: "block", default: "none" } },
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
