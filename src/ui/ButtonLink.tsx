import NextLink from "next/link";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";
import { type } from "@/tokens/typography";
import { buttonHovers, buttonStyles, buttonVariants } from "./Button";

type ButtonLinkProps = Omit<ComponentProps<typeof NextLink>, "className" | "style"> & {
  variant?: keyof typeof buttonVariants;
  size?: "default" | "small" | "large";
};

/** A link that looks like a Button. Use it when the action navigates. */
export function ButtonLink({ variant = "secondary", size = "default", ...props }: ButtonLinkProps) {
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
