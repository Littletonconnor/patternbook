import NextLink from "next/link";
import * as stylex from "@stylexjs/stylex";
import { colors, radius, space } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";

const HOVER = "@media (hover: hover)";

const styles = stylex.create({
  footer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: space.s4,
    paddingTop: space.s6,
    color: colors.inkMuted,
    borderTopWidth: 1,
    borderTopStyle: "solid",
    borderTopColor: colors.line,
  },
  links: { display: "flex", flexWrap: "wrap", gap: space.s4 },
  link: {
    color: { default: colors.inkMuted, ":hover": { default: null, [HOVER]: colors.ink } },
    textDecorationLine: "none",
    borderRadius: radius.mark,
    outlineStyle: { default: "none", ":focus-visible": "solid" },
    outlineWidth: 2,
    outlineOffset: 2,
    outlineColor: colors.focus,
  },
});

const links = [
  { label: "Figures", href: "/figures" },
  { label: "About", href: "/about" },
  { label: "Foundations", href: "/foundations" },
  { label: "GitHub", href: "https://github.com/Littletonconnor/patternbook" },
  { label: "RSS", href: "/rss.xml" },
];

export function Footer() {
  return (
    <footer {...stylex.props(type.number, styles.footer)}>
      <span>Patternbook</span>
      <nav aria-label="Footer" {...stylex.props(styles.links)}>
        {links.map((link) => (
          <NextLink key={link.label} href={link.href} {...stylex.props(styles.link)}>
            {link.label}
          </NextLink>
        ))}
      </nav>
    </footer>
  );
}
