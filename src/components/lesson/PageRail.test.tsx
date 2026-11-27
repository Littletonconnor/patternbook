import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { page } from "vitest/browser";

import { PageRail } from "./PageRail";

const items = [
  { id: "first", label: "First section" },
  { id: "second", label: "Second section" },
  { id: "third", label: "Third section" },
];

function Article() {
  return (
    <div style={{ display: "flex" }}>
      <article>
        {items.map((item) => (
          <section key={item.id} style={{ height: 1200 }}>
            <h2 id={item.id}>{item.label}</h2>
          </section>
        ))}
      </article>
      <PageRail items={items} />
    </div>
  );
}

const rail = page.getByRole("navigation", { name: "On this page" });

test("links each item to its heading and marks the first one current", async () => {
  await render(<Article />);

  await expect
    .element(rail.getByRole("link", { name: "Second section" }))
    .toHaveAttribute("href", "#second");
  await expect
    .element(rail.getByRole("link", { name: "First section" }))
    .toHaveAttribute("aria-current", "true");
});

test("marks the heading the reader has scrolled to as current", async () => {
  await render(<Article />);

  document.getElementById("third")?.scrollIntoView();

  await expect
    .element(rail.getByRole("link", { name: "Third section" }))
    .toHaveAttribute("aria-current", "true");
  await expect
    .element(rail.getByRole("link", { name: "First section" }))
    .not.toHaveAttribute("aria-current");
});

test("hides the rail on narrow screens", async () => {
  await page.viewport(1000, 800);
  await render(<Article />);

  await expect
    .element(page.getByRole("navigation", { name: "On this page", includeHidden: true }))
    .not.toBeVisible();
});
