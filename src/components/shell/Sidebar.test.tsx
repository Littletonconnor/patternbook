import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { page } from "vitest/browser";

import { MarkAsRead } from "@/components/lesson/LessonEnd";
import { lessonBySlug, topicBySlug, topics } from "@/content/catalog";
import type { Topic } from "@/content/types";

import { Sidebar } from "./Sidebar";

const sidebar = page.getByRole("complementary", { name: "Lessons" });
const levelFilter = sidebar.getByRole("group", { name: "Filter lessons by level" });

const web = topicBySlug("how-the-web-works");
const withPublishedDns: Topic = {
  ...web,
  lessons: [web.lessons[0], { ...lessonBySlug("dns"), status: "published" }],
};

test("opens the current lesson's topic and leaves the others closed", async () => {
  await render(<Sidebar topics={topics} currentSlug="dns" />);

  await expect.element(sidebar.getByText("TCP, ports and TLS")).toBeVisible();
  await expect.element(sidebar.getByText("Git is a graph of snapshots")).not.toBeInTheDocument();
  await expect.element(sidebar.getByText("17 topics · 87 lessons · 0 read")).toBeVisible();
});

test("links published lessons, shows planned ones as text, and marks the current one", async () => {
  await render(<Sidebar topics={[withPublishedDns]} currentSlug="dns" />);

  await expect
    .element(sidebar.getByRole("link", { name: "DNS" }))
    .toHaveAttribute("href", "/lessons/dns");
  await expect
    .element(sidebar.getByRole("link", { name: "DNS" }))
    .toHaveAttribute("aria-current", "page");
  await expect
    .element(sidebar.getByRole("link", { name: "What happens when you type a URL" }))
    .not.toBeInTheDocument();
  await expect.element(sidebar.getByText("What happens when you type a URL")).toBeVisible();
});

test("the level filter hides topics with no lessons at that level", async () => {
  await render(<Sidebar topics={topics} currentSlug="dns" />);

  await levelFilter.getByRole("button", { name: "Advanced" }).click();

  await expect.element(sidebar.getByText("9 topics · 28 lessons · 0 read")).toBeVisible();
  await expect.element(sidebar.getByText("How the web works")).not.toBeInTheDocument();

  await levelFilter.getByRole("button", { name: "All" }).click();

  await expect.element(sidebar.getByText("17 topics · 87 lessons · 0 read")).toBeVisible();
});

test("says so when no lesson matches the level", async () => {
  await render(<Sidebar topics={[withPublishedDns]} currentSlug="dns" />);

  await levelFilter.getByRole("button", { name: "Advanced" }).click();

  await expect.element(sidebar.getByText("No lessons at this level yet.")).toBeVisible();
  await expect.element(sidebar.getByText("0 topics · 0 lessons · 0 read")).toBeVisible();
});

test("opens a topic on click and closes every topic with collapse all", async () => {
  await render(<Sidebar topics={topics} currentSlug="dns" />);
  const collapseAll = sidebar.getByRole("button", { name: "Collapse all topics" });

  await sidebar.getByRole("button", { name: /^Git/ }).click();

  await expect.element(sidebar.getByText("Git is a graph of snapshots")).toBeVisible();

  await collapseAll.click();

  await expect.element(sidebar.getByText("Git is a graph of snapshots")).not.toBeInTheDocument();
  await expect.element(sidebar.getByText("TCP, ports and TLS")).not.toBeInTheDocument();
  await expect.element(collapseAll).toBeDisabled();
});

test("counts lessons marked as read, in total and in their topic", async () => {
  await render(
    <>
      <MarkAsRead slug="dns" />
      <Sidebar topics={topics} currentSlug="dns" />
    </>,
  );

  await page.getByRole("button", { name: "Mark as read" }).click();

  await expect.element(sidebar.getByText("17 topics · 87 lessons · 1 read")).toBeVisible();
  await expect
    .element(sidebar.getByRole("button", { name: /How the web works/ }))
    .toHaveTextContent("How the web works1/6");
  await expect.element(sidebar.getByRole("img", { name: "Read" })).toBeVisible();
});
