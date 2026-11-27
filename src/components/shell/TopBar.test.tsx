import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";

import { TopBar } from "./TopBar";

const header = page.getByRole("banner");
const menu = page.getByRole("dialog", { name: "Menu" });

test("marks the current section in the main navigation", async () => {
  await render(<TopBar current="diagrams" />);

  const nav = header.getByRole("navigation", { name: "Main" });
  await expect
    .element(nav.getByRole("link", { name: "Diagrams" }))
    .toHaveAttribute("aria-current", "page");
  await expect
    .element(nav.getByRole("link", { name: "Lessons" }))
    .not.toHaveAttribute("aria-current");
  await expect
    .element(header.getByRole("button", { name: "Open menu", includeHidden: true }))
    .not.toBeVisible();
});

test("moves the navigation into a menu on phones, with the page's extra content", async () => {
  await page.viewport(390, 800);
  await render(<TopBar current="lessons" drawer={<p>Lesson list</p>} />);

  await expect
    .element(header.getByRole("navigation", { name: "Main", includeHidden: true }))
    .not.toBeVisible();

  await header.getByRole("button", { name: "Open menu" }).click();

  await expect.element(menu).toBeVisible();
  await expect
    .element(menu.getByRole("link", { name: "Lessons" }))
    .toHaveAttribute("aria-current", "page");
  await expect.element(menu.getByText("Lesson list")).toBeVisible();

  await userEvent.keyboard("{Escape}");

  await expect.element(menu).not.toBeInTheDocument();
});
