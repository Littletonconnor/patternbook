import { Drawer as BaseDrawer } from "@base-ui/react/drawer";
import * as stylex from "@stylexjs/stylex";
import type { ReactElement, ReactNode } from "react";
import { colors, motion, radius, space } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";

const HIDDEN = ":is([data-starting-style], [data-ending-style])";
const SWIPING = ":is([data-swiping])";
const REDUCED = "@media (prefers-reduced-motion: reduce)";

const styles = stylex.create({
  backdrop: {
    position: "fixed",
    inset: 0,
    backgroundColor: colors.ink,
    opacity: {
      default: "calc(0.4 * (1 - var(--drawer-swipe-progress, 0)))",
      [HIDDEN]: 0,
    },
    transitionProperty: "opacity",
    transitionDuration: { default: motion.move, [SWIPING]: "0s", [REDUCED]: "0s" },
    transitionTimingFunction: motion.easeOut,
  },
  viewport: {
    position: "fixed",
    inset: 0,
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  popup: {
    width: "100%",
    maxWidth: 560,
    maxHeight: "85dvh",
    overflowY: "auto",
    overscrollBehavior: "contain",
    paddingTop: space.s3,
    paddingInline: space.s4,
    paddingBottom: space.s6,
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.frame,
    borderTopRightRadius: radius.frame,
    boxShadow: "0 -6px 20px rgb(22 24 29 / 0.16)",
    outlineStyle: "none",
    transform: {
      default: "translateY(var(--drawer-swipe-movement-y, 0px))",
      [HIDDEN]: "translateY(100%)",
    },
    transitionProperty: "transform",
    transitionDuration: { default: motion.move, [SWIPING]: "0s", [REDUCED]: "0s" },
    transitionTimingFunction: motion.easeOut,
  },
  handle: {
    width: 36,
    height: 4,
    marginInline: "auto",
    marginBottom: space.s4,
    borderRadius: 2,
    backgroundColor: colors.lineStrong,
  },
  title: { margin: 0, marginBottom: space.s3, color: colors.inkMuted },
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
