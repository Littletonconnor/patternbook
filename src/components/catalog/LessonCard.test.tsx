import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { page } from "vitest/browser";

import { MarkAsRead } from "@/components/lesson/LessonEnd";

import { LessonCard } from "./LessonCard";

const lesson = {
  number: 2,
  slug: "dns",
  title: "DNS",
  hook: "The internet's phone book, and its caches.",
  level: "foundations",
  minutes: 7,
} as const;

const card = page.getByRole("link", { name: /DNS/ });

test("links to the lesson and shows its number, length, level and hook", async () => {
  await render(<LessonCard lesson={lesson} />);

  await expect.element(card).toHaveAttribute("href", "/lessons/dns");
  await expect.element(card.getByText("2 · 7 min")).toBeVisible();
  await expect.element(card.getByText("Foundations")).toBeVisible();
  await expect.element(card.getByText("The internet's phone book, and its caches.")).toBeVisible();
});

test("shows a Read badge only once the lesson is marked as read", async () => {
  await render(
    <>
      <LessonCard lesson={lesson} />
      <MarkAsRead slug="dns" />
    </>,
  );

  await expect.element(card.getByText("Read", { exact: true })).not.toBeInTheDocument();

  await page.getByRole("button", { name: "Mark as read" }).click();

  await expect.element(card.getByText("Read", { exact: true })).toBeVisible();
});
