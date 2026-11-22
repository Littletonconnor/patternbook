import * as stylex from "@stylexjs/stylex";
import { colors, space } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";
import { Link } from "@/ui/Link";
import { Card, Specs } from "./Section";
import { StateMatrix } from "./StateMatrix";
import type { PreviewState } from "./StateMatrix";

const styles = stylex.create({
  prose: { margin: 0, color: colors.inkSoft },
  nav: { gap: space.s4, display: "flex" },
  note: { margin: 0, color: colors.inkSoft },
});

// Links have no pressed or disabled state.
const states = ["rest", "hover", "focus"] as const satisfies readonly PreviewState[];

function preview(state: PreviewState) {
  return state === "rest" ? {} : { "data-preview": state };
}

const rows = [
  { name: "inline", use: "In lesson prose" },
  { name: "nav", use: "Top bar; About is current" },
  { name: "plain", use: "Brand mark in the top bar" },
  { name: "external", use: "Go deeper resources" },
] as const;

function LinkSample({ row, state }: { row: (typeof rows)[number]; state: PreviewState }) {
  if (row.name === "inline") {
    return (
      <p {...stylex.props(type.small, styles.prose)}>
        Read the{" "}
        <Link href="#links" {...preview(state)}>
          pagination primer
        </Link>{" "}
        first.
      </p>
    );
  }
  if (row.name === "nav") {
    return (
      <span {...stylex.props(styles.nav)}>
        <Link variant="nav" href="#links" {...preview(state)}>
          Lessons
        </Link>
        <Link variant="nav" href="#links" current>
          About
        </Link>
      </span>
    );
  }
  if (row.name === "plain") {
    return (
      <Link variant="plain" href="#links" {...preview(state)}>
        Patternbook
      </Link>
    );
  }
  return (
    <Link variant="external" href="https://use-the-index-luke.com" {...preview(state)}>
      use-the-index-luke.com
    </Link>
  );
}

export function LinkExample() {
  return (
    <Card title="Link">
      <StateMatrix
        rows={rows}
        states={states}
        render={(row, state) => <LinkSample row={row} state={state} />}
      />
      <Specs
        rows={[
          ["Status", "Built: src/ui/Link.tsx, on next/link"],
          [
            "Props",
            "variant: inline (default) | nav | plain | external · current: nav only, sets aria-current=page",
          ],
          [
            "Inline",
            "ink text · 1px underline in lineStrong, offset 3 · hover: underline turns ink",
          ],
          ["Nav", "type.ui · inkSoft · hover and current ink · current is weight 500"],
          [
            "Plain",
            "ink · no underline · for links whose content styles itself, such as the brand",
          ],
          [
            "External",
            "underlined like inline · arrow 14 · hover: arrow turns signal and nudges 2px up-right over motion.press · opens in a new tab",
          ],
          ["Focus", "same 2px focus ring as Button, radius.mark"],
        ]}
      />
      <p {...stylex.props(type.small, styles.note)}>
        Internal pages use inline or nav. Anything that leaves the site uses external, so the reader
        knows before they click.
      </p>
    </Card>
  );
}
