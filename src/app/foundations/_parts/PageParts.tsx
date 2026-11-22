import * as stylex from "@stylexjs/stylex";
import { space } from "@/tokens/tokens.stylex";
import { TooltipProvider } from "@/ui/Tooltip";
import { Section } from "./Section";
import { TopBarPart, SidebarPart, PageRailPart, FooterPart } from "./PartsFrame";
import { LessonHeaderPart, LessonCardPart, ProsePart, CodeBlockPart } from "./PartsLesson";
import { TablePart, ResourceListPart, LessonEndPart, PagerPart } from "./PartsLessonEnd";
const styles = stylex.create({
  grid: { gap: space.s4, display: "flex", flexDirection: "column" },
});

export function PageParts() {
  return (
    <Section eyebrow="05 · Page parts · src/components" title="The furniture around a lesson">
      <TooltipProvider>
        <div {...stylex.props(styles.grid)}>
          <TopBarPart />
          <SidebarPart />
          <LessonHeaderPart />
          <LessonCardPart />
          <ProsePart />
          <CodeBlockPart />
          <TablePart />
          <PageRailPart />
          <ResourceListPart />
          <LessonEndPart />
          <PagerPart />
          <FooterPart />
        </div>
      </TooltipProvider>
    </Section>
  );
}
