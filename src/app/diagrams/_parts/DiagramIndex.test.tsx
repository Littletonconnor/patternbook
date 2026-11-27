import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { page } from "vitest/browser";

import { DiagramIndex } from "./DiagramIndex";

const entries = [
  {
    diagram: { number: "2.1", kind: "flow", title: "Resolve a name", lesson: "dns" },
    lesson: { number: 2, slug: "dns", title: "DNS" },
  },
  {
    diagram: {
      number: "3.1",
      kind: "flow",
      title: "The TLS handshake",
      lesson: "tcp-ports-and-tls",
    },
    lesson: { number: 3, slug: "tcp-ports-and-tls", title: "TCP, ports and TLS" },
  },
  {
    diagram: { number: "2.2", kind: "race", title: "A stale cache entry", lesson: "dns" },
    lesson: { number: 2, slug: "dns", title: "DNS" },
  },
] as const;

const filter = page.getByRole("group", { name: "Filter by kind" });

test("offers only the kinds that have diagrams, with a count for each", async () => {
  await render(<DiagramIndex entries={entries} />);

  await expect
    .element(filter.getByRole("button", { name: /^All\s*3$/ }))
    .toHaveAttribute("aria-pressed", "true");
  await expect.element(filter.getByRole("button", { name: /^Flow\s*2$/ })).toBeVisible();
  await expect.element(filter.getByRole("button", { name: /^Race\s*1$/ })).toBeVisible();
  await expect.element(filter.getByRole("button", { name: /Timeline/ })).not.toBeInTheDocument();
});

test("shows only the chosen kind, and every diagram again under All", async () => {
  await render(<DiagramIndex entries={entries} />);

  await filter.getByRole("button", { name: /^Race\s*1$/ }).click();

  await expect.element(page.getByRole("link", { name: /A stale cache entry/ })).toBeVisible();
  await expect.element(page.getByRole("link", { name: /Resolve a name/ })).not.toBeInTheDocument();

  await filter.getByRole("button", { name: /^All\s*3$/ }).click();

  await expect.element(page.getByRole("link", { name: /Resolve a name/ })).toBeVisible();
});

test("links each diagram to its lesson", async () => {
  await render(<DiagramIndex entries={entries} />);

  await expect
    .element(page.getByRole("link", { name: /The TLS handshake/ }))
    .toHaveAttribute("href", "/lessons/tcp-ports-and-tls");
});
