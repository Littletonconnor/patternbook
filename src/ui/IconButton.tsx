import { Button as BaseButton } from "@base-ui/react/button";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";
import { buttonStyles, buttonVariants, buttonHovers } from "./Button";
import type { LucideIcon } from "lucide-react";
import { Icon } from "./Icon";

const styles = stylex.create({
  square: { paddingInline: 0, width: 36 },
  squareSmall: { paddingInline: 0, width: 32 },
});

type IconButtonProps = Omit<
  ComponentProps<typeof BaseButton>,
  "className" | "style" | "children" | "aria-label"
> & {
  icon: LucideIcon;
  label: string;
  variant?: "secondary" | "ghost";
  size?: "default" | "small";
};

export function IconButton({
  variant = "secondary",
  size = "default",
  icon,
  label,
  ...props
}: IconButtonProps) {
  return (
    <BaseButton
      {...props}
      aria-label={label}
      {...stylex.props(
        buttonStyles.base,
        size === "small" && buttonStyles.small,
        size === "small" ? styles.squareSmall : styles.square,
        buttonVariants[variant],
        props.disabled ? buttonStyles.disabled : buttonHovers[variant],
      )}
    >
      <Icon icon={icon} />
    </BaseButton>
  );
}
