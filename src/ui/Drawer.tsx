import { Drawer as BaseDrawer } from "@base-ui/react/drawer";
import * as stylex from "@stylexjs/stylex";
import type { ReactElement, ReactNode } from "react";
import { colors, motion, radius, shadows, space } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";

const HIDDEN = ":is([data-starting-style], [data-ending-style])";
const SWIPING = ":is([data-swiping])";
const REDUCED = "@media (prefers-reduced-motion: reduce)";

const styles = stylex.create({
  backdrop: {
    inset: 0,
    backgroundColor: colors.ink,
    opacity: {
      [HIDDEN]: 0,
      default: "calc(0.4 * (1 - var(--drawer-swipe-progress, 0)))",
    },
    position: "fixed",
    transitionDuration: { [REDUCED]: "0s", [SWIPING]: "0s", default: motion.move },
    transitionProperty: "opacity",
    transitionTimingFunction: motion.easeOut,
  },
  viewport: {
    inset: 0,
    alignItems: "flex-end",
    display: "flex",
    justifyContent: "center",
    position: "fixed",
  },
  popup: {
    overscrollBehavior: "contain",
    paddingInline: space.s4,
    backgroundColor: colors.surface,
    boxShadow: shadows.sheet,
    outlineStyle: "none",
    transform: {
      [HIDDEN]: "translateY(100%)",
      default: "translateY(var(--drawer-swipe-movement-y, 0px))",
    },
    transitionDuration: { [REDUCED]: "0s", [SWIPING]: "0s", default: motion.move },
    transitionProperty: "transform",
    transitionTimingFunction: motion.easeOut,
    borderTopLeftRadius: radius.frame,
    borderTopRightRadius: radius.frame,
    maxHeight: "85dvh",
    maxWidth: 560,
    overflowY: "auto",
    paddingBottom: space.s6,
    paddingTop: space.s3,
    width: "100%",
  },
  handle: {
    borderRadius: 2,
    marginInline: "auto",
    backgroundColor: colors.lineStrong,
    height: 4,
    marginBottom: space.s4,
    width: 36,
  },
  title: { margin: 0, color: colors.inkMuted, marginBottom: space.s3 },
});

type DrawerProps = {
  trigger: ReactElement;
  title: string;
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function Drawer({ trigger, title, children, open, onOpenChange }: DrawerProps) {
  return (
    <BaseDrawer.Root
      open={open}
      onOpenChange={onOpenChange ? (next) => onOpenChange(next) : undefined}
    >
      <BaseDrawer.Trigger render={trigger} />
      <BaseDrawer.Portal>
        <BaseDrawer.Backdrop {...stylex.props(styles.backdrop)} />
        <BaseDrawer.Viewport {...stylex.props(styles.viewport)}>
          <BaseDrawer.Popup {...stylex.props(styles.popup)}>
            <div {...stylex.props(styles.handle)} />
            <BaseDrawer.Content>
              <BaseDrawer.Title {...stylex.props(type.label, styles.title)}>
                {title}
              </BaseDrawer.Title>
              {children}
            </BaseDrawer.Content>
          </BaseDrawer.Popup>
        </BaseDrawer.Viewport>
      </BaseDrawer.Portal>
    </BaseDrawer.Root>
  );
}
