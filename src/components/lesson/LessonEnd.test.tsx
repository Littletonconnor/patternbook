import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { page } from "vitest/browser";

import { Feedback, MarkAsRead } from "./LessonEnd";

test("marks a lesson as read, and unmarks it on a second press", async () => {
  await render(<MarkAsRead slug="dns" />);

  await page.getByRole("button", { name: "Mark as read" }).click();

  await expect
    .element(page.getByRole("button", { name: "Read" }))
    .toHaveAttribute("aria-pressed", "true");

  await page.getByRole("button", { name: "Read" }).click();

  await expect.element(page.getByRole("button", { name: "Mark as read" })).toBeVisible();
});

test("remembers a read lesson after the page renders it again", async () => {
  const first = await render(<MarkAsRead slug="tcp-ports-and-tls" />);
  await page.getByRole("button", { name: "Mark as read" }).click();
  await first.unmount();

  await render(<MarkAsRead slug="tcp-ports-and-tls" />);

  await expect.element(page.getByRole("button", { name: "Read" })).toBeVisible();
});

test("thanks the reader after either feedback answer", async () => {
  await render(<Feedback />);

  await page.getByRole("button", { name: "Not quite" }).click();

  await expect.element(page.getByText("Thanks")).toBeVisible();
  await expect.element(page.getByRole("button", { name: "Yes" })).not.toBeInTheDocument();
});
