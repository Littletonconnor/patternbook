import * as stylex from "@stylexjs/stylex";
import { ArrowUpRight } from "lucide-react";
import NextLink from "next/link";
import type { LinkProps as NextLinkProps } from "next/link";

import { colors, motion, radius } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";

import { Icon } from "./Icon";

const HOVER = "@media (hover: hover)";
const PREVIEW_HOVER = ":is([data-preview=hover])";
const PREVIEW_FOCUS = ":is([data-preview=focus])";

const styles = stylex.create({
  base: {
    borderRadius: radius.mark,
    outlineColor: colors.focus,
    outlineOffset: 2,
    outlineStyle: { [PREVIEW_FOCUS]: "solid", default: "none", ":focus-visible": "solid" },
    outlineWidth: 2,
    transitionDuration: motion.press,
    transitionProperty: "color, text-decoration-color",
    transitionTimingFunction: motion.easeOut,
  },
  underlined: {
    color: colors.ink,
    textDecorationColor: {
      [PREVIEW_HOVER]: colors.ink,
      default: colors.lineStrong,
      ":hover": { [HOVER]: colors.ink, default: null },
    },
    textDecorationLine: "underline",
    textDecorationThickness: 1,
    textUnderlineOffset: 3,
  },
  nav: {
    color: {
      [PREVIEW_HOVER]: colors.ink,
      default: colors.inkSoft,
      ":hover": { [HOVER]: colors.ink, default: null },
    },
    textDecorationLine: "none",
  },
  plain: {
    alignItems: "center",
    color: colors.ink,
    display: "inline-flex",
    textDecorationLine: "none",
  },
  current: { color: colors.ink, fontWeight: 500 },
  arrow: {
    color: {
      default: colors.inkMuted,
      [stylex.when.ancestor(":hover")]: colors.signal,
      [stylex.when.ancestor(PREVIEW_HOVER)]: colors.signal,
    },
    display: "inline-flex",
    marginInlineStart: 2,
    transform: {
      default: null,
      [stylex.when.ancestor(":hover")]: "translate(2px, -2px)",
      [stylex.when.ancestor(PREVIEW_HOVER)]: "translate(2px, -2px)",
    },
    transitionDuration: motion.press,
    transitionProperty: "color, transform",
    transitionTimingFunction: motion.easeOut,
    verticalAlign: "-2px",
  },
});

type LinkProps<RouteType> = Omit<NextLinkProps<RouteType>, "className" | "style"> & {
  variant?: "inline" | "nav" | "plain" | "external";
  current?: boolean;
};

const variantStyles = {
  inline: styles.underlined,
  nav: [type.ui, styles.nav],
  plain: styles.plain,
};

function ExternalLink<RouteType>({
  children,
  ...props
}: Omit<LinkProps<RouteType>, "variant" | "current">) {
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

export function Link<RouteType>({
  variant = "inline",
  current = false,
  children,
  ...props
}: LinkProps<RouteType>) {
  if (variant === "external") {
    return <ExternalLink {...props}>{children}</ExternalLink>;
  }
  return (
    <NextLink
      aria-current={current ? "page" : undefined}
      {...props}
      {...stylex.props(
        styles.base,
        variantStyles[variant],
        variant === "nav" && current && styles.current,
      )}
    >
      {children}
    </NextLink>
  );
}
