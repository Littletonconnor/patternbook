import * as stylex from "@stylexjs/stylex";
import { colors, space } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";
import { Link } from "@/ui/Link";

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
          <Link key={link.label} variant="nav" href={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>
    </footer>
  );
}
