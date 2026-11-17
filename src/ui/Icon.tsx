import type { LucideIcon } from "lucide-react";

type IconProps = {
  icon: LucideIcon;
  size?: 12 | 14 | 16 | 20;
  label?: string;
};

export function Icon({ icon: Glyph, size = 16, label }: IconProps) {
  return (
    <Glyph
      size={size}
      strokeWidth={1.5}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? "img" : undefined}
    />
  );
}
