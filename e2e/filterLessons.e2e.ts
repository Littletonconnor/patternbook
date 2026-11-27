import { expect, test } from "@playwright/test";

test("the level filter narrows the sidebar and is remembered on the next page", async ({
  page,
}) => {
  await page.goto("/lessons/what-happens-when-you-type-a-url");
  const sidebar = page.getByRole("complementary", { name: "Lessons" });
  const filter = sidebar.getByRole("group", { name: "Filter lessons by level" });

  await filter.getByRole("button", { name: "Advanced" }).click();

  await expect(sidebar.getByText("9 topics · 28 lessons · 0 read")).toBeVisible();
  await expect(sidebar.getByText("How the web works")).toBeHidden();

  await page.goto("/lessons/dns");

  await expect(filter.getByRole("button", { name: "Advanced" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(sidebar.getByText("9 topics · 28 lessons · 0 read")).toBeVisible();
});
