import * as stylex from "@stylexjs/stylex";
import NextLink from "next/link";
import type { LinkProps as NextLinkProps } from "next/link";

import { type } from "@/tokens/typography";

import { buttonHovers, buttonStyles, buttonVariants } from "./Button";

type ButtonLinkProps<RouteType> = Omit<NextLinkProps<RouteType>, "className" | "style"> & {
  variant?: keyof typeof buttonVariants;
  size?: "default" | "small" | "large";
};

export function ButtonLink<RouteType>({
  variant = "secondary",
  size = "default",
  ...props
}: ButtonLinkProps<RouteType>) {
  return (
    <NextLink
      {...props}
      {...stylex.props(
        type.control,
        buttonStyles.base,
        size !== "default" && buttonStyles[size],
        buttonVariants[variant],
        buttonHovers[variant],
        styles.link,
      )}
    />
  );
}

const styles = stylex.create({
  link: { boxSizing: "border-box", textDecorationLine: "none" },
});
