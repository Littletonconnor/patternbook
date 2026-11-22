import * as stylex from "@stylexjs/stylex";

import { colors, space } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";

const areas = [
  {
    title: "Patterns",
    body: "Pagination, caching, optimistic updates, debouncing, indexes, transactions, auth, rate limiting, retries, real-time sync.",
  },
  {
    title: "Under the hood",
    body: "HTTP and the browser, the shell and Linux processes, how Git stores history, and how containers are built from namespaces and cgroups.",
  },
  {
    title: "Diagrams",
    body: "How the diagrams on this site are built: interactive SVG, path animation and scroll-driven diagrams.",
  },
];

const styles = stylex.create({
  areas: {
    gap: space.s8,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 1fr))",
  },
  area: {
    gap: space.s2,
    display: "flex",
    flexDirection: "column",
    borderTopColor: colors.ink,
    borderTopStyle: "solid",
    borderTopWidth: 1.5,
    paddingTop: space.s4,
  },
  title: { fontWeight: 600 },
  soft: { color: colors.inkSoft },
});

export function AboutAreas() {
  return (
    <div {...stylex.props(styles.areas)}>
      {areas.map((area) => (
        <div key={area.title} {...stylex.props(styles.area)}>
          <span {...stylex.props(type.body, styles.title)}>{area.title}</span>
          <span {...stylex.props(type.small, styles.soft)}>{area.body}</span>
        </div>
      ))}
    </div>
  );
}
