import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";
import { topics } from "@/content/catalog";
import { measure, space } from "@/tokens/tokens.stylex";
import { Footer } from "./Footer";
import { Sidebar } from "./Sidebar";
import { TopBar, type Section } from "./TopBar";

const WIDE = "@media (min-width: 768px)";

const styles = stylex.create({
  page: { display: "flex", flexDirection: "column", minHeight: "100dvh" },
  topBar: { position: "sticky", top: 0, zIndex: 10 },
  main: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    paddingInline: { default: space.s4, [WIDE]: space.s6 },
    paddingTop: { default: space.s12, [WIDE]: space.s16 },
    paddingBottom: space.s8,
  },
  column: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    gap: space.s16,
    width: "100%",
    marginInline: "auto",
  },
});

const widths = stylex.create({
  wide: { maxWidth: measure.lesson },
  narrow: { maxWidth: measure.diagram },
});

type PageShellProps = {
  current?: Section;
  width?: keyof typeof widths;
  children: ReactNode;
};

export function PageShell({ current, width = "wide", children }: PageShellProps) {
  return (
    <div {...stylex.props(styles.page)}>
      <div {...stylex.props(styles.topBar)}>
        <TopBar current={current} drawer={<Sidebar topics={topics} />} />
      </div>
      <main {...stylex.props(styles.main)}>
        <div {...stylex.props(styles.column, widths[width])}>
          {children}
          <Footer />
        </div>
      </main>
    </div>
  );
}
