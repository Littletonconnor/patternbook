import NextLink from "next/link";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";
import { ArrowUpRight } from "lucide-react";
import { colors, motion, radius } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";
import { Icon } from "./Icon";

const HOVER = "@media (hover: hover)";
const PREVIEW_HOVER = ":is([data-preview=hover])";
const PREVIEW_FOCUS = ":is([data-preview=focus])";

const styles = stylex.create({
  base: {
    borderRadius: radius.mark,
    outlineStyle: { default: "none", ":focus-visible": "solid", [PREVIEW_FOCUS]: "solid" },
    outlineWidth: 2,
    outlineOffset: 2,
    outlineColor: colors.focus,
    transitionProperty: "color, text-decoration-color",
    transitionDuration: motion.press,
    transitionTimingFunction: motion.easeOut,
  },
  underlined: {
    color: colors.ink,
    textDecorationLine: "underline",
    textDecorationThickness: 1,
    textUnderlineOffset: 3,
    textDecorationColor: {
      default: colors.lineStrong,
      ":hover": { default: null, [HOVER]: colors.ink },
      [PREVIEW_HOVER]: colors.ink,
    },
  },
  nav: {
    textDecorationLine: "none",
    color: {
      default: colors.inkSoft,
      ":hover": { default: null, [HOVER]: colors.ink },
      [PREVIEW_HOVER]: colors.ink,
    },
  },
  current: { color: colors.ink, fontWeight: 500 },
  arrow: {
    display: "inline-flex",
    marginInlineStart: 2,
    verticalAlign: "-2px",
    color: {
      default: colors.inkMuted,
      [stylex.when.ancestor(":hover")]: colors.signal,
      [stylex.when.ancestor(PREVIEW_HOVER)]: colors.signal,
    },
    transform: {
      default: null,
      [stylex.when.ancestor(":hover")]: "translate(2px, -2px)",
      [stylex.when.ancestor(PREVIEW_HOVER)]: "translate(2px, -2px)",
    },
    transitionProperty: "color, transform",
    transitionDuration: motion.press,
    transitionTimingFunction: motion.easeOut,
  },
});

type LinkProps = Omit<ComponentProps<typeof NextLink>, "className" | "style"> & {
  variant?: "inline" | "nav" | "external";
  current?: boolean;
};

export function Link({ variant = "inline", current = false, children, ...props }: LinkProps) {
  if (variant === "external") {
    return (
      <NextLink
        target="_blank"
        rel="noreferrer"
        {...props}
        {...stylex.props(styles.base, styles.underlined, stylex.defaultMarker())}
      >
        {children}
        <span {...stylex.props(styles.arrow)}>
          <Icon icon={ArrowUpRight} size={14} />
        </span>
      </NextLink>
    );
  }

  return (
    <NextLink
      aria-current={current ? "page" : undefined}
      {...props}
      {...stylex.props(
        styles.base,
        variant === "nav" && type.ui,
        variant === "inline" ? styles.underlined : styles.nav,
        variant === "nav" && current && styles.current,
      )}
    >
      {children}
    </NextLink>
  );
}
