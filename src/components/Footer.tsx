import NextLink from "next/link";
import * as stylex from "@stylexjs/stylex";
import { colors, radius, space } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";

const HOVER = "@media (hover: hover)";

const styles = stylex.create({
  footer: {
    gap: space.s4,
    color: colors.inkMuted,
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    borderTopColor: colors.line,
    borderTopStyle: "solid",
    borderTopWidth: 1,
    paddingTop: space.s6,
  },
  links: { gap: space.s4, display: "flex", flexWrap: "wrap" },
  link: {
    borderRadius: radius.mark,
    color: { default: colors.inkMuted, ":hover": { [HOVER]: colors.ink, default: null } },
    outlineColor: colors.focus,
    outlineOffset: 2,
    outlineStyle: { default: "none", ":focus-visible": "solid" },
    outlineWidth: 2,
    textDecorationLine: "none",
  },
});

const links = [
  { label: "Diagrams", href: "/diagrams" },
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
